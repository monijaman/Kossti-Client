import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "@/redux/store";
import { fetchCount } from "./uploadAPI";
import { ProductPhotos } from "@/lib/types";

// Define the payload type
interface UploadMediaPayload {
  productId: number;
  files: File[];
}

interface removeMediaPayload {
  creativeId: number;
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
  dataset?: any;
  error?: string;
  creativeId?: number;
}

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(uploadmedia(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
// Create the async thunk for uploading media
export const uploadmedia = createAsyncThunk<ApiResponse, UploadMediaPayload>(
  "upload/files",
  async (payload, { getState }) => {
    const { productId, files } = payload; // Fixed typo from prodductId to productId

    // Initialize formData as a FormData object
    const formData = new FormData();
    const state = getState() as RootState;
    const campaignId = state.upload.campaign_id;
    const name = ""; // Adjust this value as needed

    formData.append("product_id", productId.toString()); // Convert to string
    formData.append("apiUrl", "/productimages");

    // Append each file to the FormData object
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    try {
      // Handle the API call
      const response = await fetch("/api/multipart", {
        method: "POST",
        body: formData, // FormData is used directly as body
        // Note: Do not set Content-Type header, fetch will automatically set it to multipart/form-data
      });

      // Assuming the response is JSON
      const responseArray = await response.json();
      const { dataset } = responseArray;
      // Check if the request was successful

      if (dataset.error.code) {
        return {
          success: false,
          error:
            `${dataset.error.file_name} - ${dataset.error.message}` ||
            "Unknown error",
        };
      } else {
        return {
          success: true,
          dataset,
        };
      }
    } catch (error) {
      // Handle any errors that occurred during the fetch
      return {
        success: false,
        error: (error as Error).message || "Unknown server error",
      };
    }
  }
);
export const removeMedia = createAsyncThunk<ApiResponse, removeMediaPayload>(
  "upload/removemedia",
  async (payload, { getState }) => {
    const { creativeId } = payload;
    const apiUrl = `productimages/${creativeId}`; // Construct the API URL

    const newFormData = {
      apiUrl: `creatives/${creativeId}`,
    };

    const response = await fetch("/api/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newFormData), // Include apiUrl in the request body
    });

    if (!response.ok) {
      throw new Error("Failed to delete campaign");
    }

    const responseObj = await response.json();
    responseObj.creativeId = creativeId;
    return responseObj; // Parse the response as JSON
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
        } else {
          state.uploadedFiles.push(...action.payload.dataset.data);
        }
      })
      .addCase(uploadmedia.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(removeMedia.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeMedia.fulfilled, (state, action) => {
        state.status = "idle";

        const existingItem = state.uploadedFiles.filter((creative) => {
          return action.payload.creativeId !== creative.id;
        });
        state.uploadedFiles = existingItem;
      })
      .addCase(removeMedia.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(confirmMedia.pending, (state) => {
        state.confirmStatus = "loading";
      })
      .addCase(confirmMedia.fulfilled, (state, action) => {
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
