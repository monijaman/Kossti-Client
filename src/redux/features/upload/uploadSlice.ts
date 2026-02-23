import { ProductPhotos } from "@/lib/types";
import { RootState } from "@/redux/store";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the payload type
interface UploadMediaPayload {
  productId: number;
  files: File[];
}

interface removeMediaPayload {
  productId: number;
}

export interface UploadState {
  files: File[];
  campaign_id: number | null;
  client_id: number | null;
  status: "idle" | "loading" | "failed";
  confirmStatus: "idle" | "loading" | "failed" | "complete";
  uploadedFiles: ProductPhotos[];
  error: string;
}

const initialState: UploadState = {
  files: [],
  campaign_id: null,
  client_id: null,
  status: "idle",
  confirmStatus: "idle",
  uploadedFiles: [],
  error: "",
};

// Define the API response type if needed
interface ApiResponse {
  success: boolean;
  images?: ProductPhotos;
  error?: string;
  productId?: number;
}

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(uploadmedia(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
// Create the async thunk for uploading media
export const uploadmedia = createAsyncThunk<ApiResponse, UploadMediaPayload>(
  "upload/files",
  async (payload) => {
    const { productId, files } = payload; // Fixed typo from prodductId to productId

    // Presigned S3 upload flow:
    // 1) For each file request a presigned URL from the Next.js proxy /api/s3-presign
    // 2) PUT the file to the presigned URL
    // 3) Register the uploaded keys with the backend via /api/s3-register
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    try {
      const uploadedFiles: {
        key: string;
        name: string;
        url: string;
        size: number;
      }[] = [];

      for (const file of files) {
        // 1) get presign URL
        const presignResp = await fetch("/api/s3-presign", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type,
            productId,
          }),
        });

        const presignJson = await presignResp.json();
        if (!presignResp.ok || !presignJson.data) {
          return {
            success: false,
            error: presignJson.error || "Failed to get presign URL",
          };
        }

        const { url, key, objectUrl } = presignJson.data as {
          url: string;
          key: string;
          objectUrl?: string;
        };

        // 2) PUT file to S3
        const putResp = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        });

        if (!putResp.ok) {
          return { success: false, error: `Failed to upload ${file.name}` };
        }

        uploadedFiles.push({
          key,
          name: file.name,
          url: objectUrl || "",
          size: file.size,
        });
      }

      // 3) Register uploaded files with backend
      const registerResp = await fetch("/api/s3-register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ product_id: productId, files: uploadedFiles }),
      });

      const registerJson = await registerResp.json();
      if (!registerResp.ok) {
        return {
          success: false,
          error: registerJson.error || "Failed to register files",
        };
      }

      return { success: true, productId };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message || "Unknown server error",
      };
    }
  }
);
export const removeMedia = createAsyncThunk<ApiResponse, removeMediaPayload>(
  "upload/removemedia",
  async (payload) => {
    const { productId } = payload;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8083";
    const endpoint = `${apiUrl}/imageremove/${productId}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete image");
    }

    const data = await response.json();

    return {
      success: true,
      data: data,
    };

    if (data.images) {
      return {
        success: true,
        productId: productId,
      };
    } else {
      return {
        success: false,
        error: `"Unknown error`,
      };
    }
  }
);

export const confirmMedia = createAsyncThunk<ApiResponse, void>(
  "upload/confirm",
  async (_, { getState }) => {
    // Removed the payload parameter and replaced it with _

    // const { creativeId } = payload;
    const state = getState() as RootState;
    const creativeIdArray = state.upload.uploadedFiles.map(
      (creative) => creative.id
    );
    const newFormData = {
      creative_ids: creativeIdArray,
      apiUrl: `creatives/confirm`,
    };

    const response = await fetch("/api/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newFormData), // Include apiUrl in the request body
    });

    if (!response.ok) {
      throw new Error("Failed to delete campaign");
    }

    const responseObj = await response.json();

    // responseObj.creativeId = creativeId
    return responseObj; // Parse the response as JSON
  }
);

export const uploadSlice = createSlice({
  name: "upload",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setCampaignId: (state, action: PayloadAction<number>) => {
      state.campaign_id = action.payload;
      state.confirmStatus = "idle";
    },
    setClientId: (state, action: PayloadAction<number>) => {
      state.client_id = action.payload;
      state.confirmStatus = "idle";
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(uploadmedia.pending, (state) => {
        state.status = "loading";
        state.confirmStatus = "idle";
      })
      .addCase(uploadmedia.fulfilled, (state, action) => {
        state.status = "idle";
        if (action.payload.error) {
          state.error = action.payload.error;
          state.confirmStatus = "failed";
        }
      })
      .addCase(uploadmedia.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(removeMedia.pending, (state) => {
        state.status = "loading";
        state.uploadedFiles = [];
      })
      .addCase(removeMedia.fulfilled, (state) => {
        state.status = "idle";
      })
      .addCase(removeMedia.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(confirmMedia.pending, (state) => {
        state.confirmStatus = "loading";
      })
      .addCase(confirmMedia.fulfilled, (state) => {
        state.confirmStatus = "complete";
        state.uploadedFiles = [];
        //  state.campaign_id = null;
        state.client_id = null;

        // state.uploadedFiles = existingItem
      })
      .addCase(confirmMedia.rejected, (state) => {
        state.confirmStatus = "failed";
      });
  },
});

export const { setClientId, setCampaignId } = uploadSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.upload.value)`
export const selectstatus = (state: RootState) => state.upload.status;
export const selectCampaignId = (state: RootState) => state.upload.campaign_id;
export const selectClientId = (state: RootState) => state.upload.client_id;
export const selectUploadedFiles = (state: RootState) =>
  state.upload.uploadedFiles;
export const selectconfirmStatus = (state: RootState) =>
  state.upload.confirmStatus;
export const selectUploadError = (state: RootState) => state.upload.error;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.

export default uploadSlice.reducer;
