import { Button } from "@/components/ui/button";
import RadioButton from "@/components/ui/Radio";
import RenderPreview from "@/components/Uploader/RenderPreview";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useProducts } from "@/hooks/useProducts";
import { ProductPhotos } from '@/lib/types';
import {
  removeMedia,
  selectstatus,
  selectUploadedFiles,
  uploadmedia,
} from "@/redux/features/upload/uploadSlice";
import Image from "next/image";
import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import "./uploader.scss";

// Define the props for the DragNdrop component
interface DragNdropProps {
  onFilesSelected: (files: File[]) => void;
  productId: number;
  width: string;
  height: string;
}

const DragNdrop = ({
  onFilesSelected,
  productId,
  width,
  height,
}: DragNdropProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const approvedFileTypes = [".zip", ".mp4", ".jpg", ".png", ".gif"];
  const dispatch = useAppDispatch();
  const selectedFilesRef = useRef<File[]>([]);
  const uploadedDataset = useAppSelector(selectUploadedFiles);
  const status = useAppSelector(selectstatus);
  const [selectedValue, setSelectedValue] = useState<string | number>("");

  // check if file is valid
  const checkfileValidity = (selectedFiles: FileList) => {
    const validFiles = Array.from(selectedFiles).filter((file) =>
      approvedFileTypes.some((ext) =>
        file.name.toLocaleLowerCase().endsWith(ext)
      )
    );

    setFiles((prevFiles) => [...prevFiles, ...validFiles]);
    selectedFilesRef.current = validFiles; // Update useRef with valid files
  };
  const [photos, setPhotos] = useState<ProductPhotos[]>([])
  const { getPhotosByProductId, MakePhotoDefault } = useProducts();

  const uploadMedia = () => {
    // Dispatch the thunk action with the files
    if (files.length < 1) {
      return;
    }

    dispatch(uploadmedia({ productId, files: files }))
      .then(() => {
        getPhotos(); // Call getPhotos after dispatch is done
      })
      .catch((error) => {
        console.error("Error removing media:", error);
      });

    //  setPhotos(uploadedDataset);
    setFiles([])

  };

  const getPhotos = async () => {
    const response = await getPhotosByProductId(productId);

    setPhotos(response.data);

    const defaultFile = response.data.find((file: ProductPhotos) => file.defaultphoto === 1);


    if (defaultFile) {
      setSelectedValue(defaultFile.id);
    }

    // setSelectedValue();
  }

  // when browse input for files;
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      checkfileValidity(selectedFiles);
    }
    event.target.value = '';
  };

  const handleRemoveUPloadedFile = async (productId: number) => {
    try {
      dispatch(removeMedia({ productId }))
        .then(() => {
          getPhotos(); // Call getPhotos after dispatch is done
        })
        .catch((error) => {
          console.error("Error removing media:", error);
        });

    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle the error if necessary
      return null; // Return null or handle the error case appropriately
    }
  };

  // when drop files
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;

    checkfileValidity(droppedFiles);
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));

    selectedFilesRef.current = selectedFilesRef.current.filter(
      (_, i) => i !== index
    );
  };

  const makePhotoDefault = async (selectedValue: number) => {
    const response = await MakePhotoDefault(selectedValue);
    setPhotos(response.data);
  }

  // if file is selected
  useEffect(() => {
    onFilesSelected(files);
  }, [files, onFilesSelected]);




  useEffect(() => {

    getPhotos();
  }, [files])




  const handleRadioChange = (newValue: string | number, name: string) => {
    setSelectedValue(newValue); // Store the selected id
    makePhotoDefault(+newValue);

  };

  return (
    <>
      <section className="drag-drop" style={{ width: width, height: height }}>
        <div
          className={`document-uploader ${files.length > 0 ? "upload-box active" : "upload-box"
            }`}
          onDrop={handleDrop}
          onDragOver={(event) => event.preventDefault()}
        >
          <div className="file-types">
            <div className="file-types__item">
              <Image
                src={`/icons/image.svg`} // Ensure backticks are
                alt="Image"
                title={"image"}
                sizes="100vw"
                width={44}
                height={44}
                priority // Optional: Set priority for loading
              />
              <div>
                <h5>Add Image file</h5>
                <h6> All .gif, .png, .jpg</h6>
              </div>
            </div>
          </div>

          <>
            <div className="upload-box">
              <div className="upload-info">
                <Image
                  className="content-card__image"
                  src={`/icons/upload.svg`} // Ensure backticks are
                  alt="Tick Icon"
                  title={""}
                  sizes="100vw"
                  width={44}
                  height={44}
                  priority // Optional: Set priority for loading
                />

                <div>
                  <p>
                    Drop your files or click on the button to upload your files
                  </p>
                </div>
              </div>
              <input
                type="file"
                hidden
                id="browse"
                onChange={handleFileChange}
                accept=".zip,.mp4,.jpg,.png.gif"
                multiple
              />
              <label htmlFor="browse" className="browse-btn">
                Browse files
              </label>
            </div>

            {status === "loading" && "loading..."}

            {/* Upload Files  */}

            <div className="file-list">
              <div className="file-list__container">
                <table>
                  <tbody>

                    {files.length > 0 &&
                      files.map((file, index) => (
                        <tr key={index}>
                          <td>
                            <div className="preview-container">
                              <RenderPreview file={file} fileurl={null} />
                            </div>
                          </td>
                          <td>{file.name}</td>
                          <td>{file.type}</td>
                          <td>{Math.ceil(file.size / 10000)}KB</td>
                          <td> </td>

                          <td>
                            <div className="remove-file" onClick={() => handleRemoveFile(index)}>
                              Remove
                            </div>
                          </td>
                        </tr>
                      ))
                    }
                    {files.length > 0 &&
                      <tr>
                        <td colSpan={5} className="text-center">
                          <Button
                            className="bg-blue-500 my-4 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                            onClick={uploadMedia}
                          >
                            Upload
                          </Button>
                        </td>
                      </tr>
                    }


                    {photos &&
                      photos.map((file, index) => (
                        <tr key={index}>
                          <td>
                            <div className="preview-container">
                              <Image src={file.asset_url} alt="" width={50} height={50} />
                            </div>
                          </td>
                          <td>{file.name}</td>
                          <td>{file.file_size && Math.ceil(file.file_size / 10000)}KB</td>
                          <td>

                            <RadioButton
                              name="defaultValue"
                              value={file.id}  // Pass the `id` directly
                              selectedValue={selectedValue ?? 0} // Fallback to 0 or any default id when no file has default == 1
                              updateValue={handleRadioChange}
                            >

                            </RadioButton>
                          </td>
                          <td>
                            <div
                              className="remove-file"
                              onClick={() => handleRemoveUPloadedFile(file.id)}
                            >
                              Remove
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {files.length > 0 && (
              <div className="success-file">
                <Image
                  className="total-files"
                  src={`/icons/circle.svg`} // Ensure backticks are
                  alt="Tick Icon"
                  title={""}
                  sizes="100vw"
                  style={{
                    width: "23px",
                    height: "23px",
                  }}
                  width={24}
                  height={24}
                  priority // Optional: Set priority for loading
                />

                <p>{files.length} file(s) selected</p>
              </div>
            )}
          </>
        </div>

      </section>
    </>
  );
};

export default DragNdrop;
