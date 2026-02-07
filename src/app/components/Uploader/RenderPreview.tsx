import Image from "next/image";
import "./uploader.scss";


interface propTypes {
  file: File | null;
  fileurl: string | null;
}
const RenderPreview = ({ file, fileurl }: propTypes) => {
  let imgThumb = "";
  let extension;
  let filename = "";

  if (file) {
    imgThumb = URL.createObjectURL(file);

    extension = file.name.toLocaleLowerCase().split(".").pop();
    filename = file.name;
  } else if (fileurl) {
    extension = fileurl.toLocaleLowerCase().split(".").pop();
    imgThumb = fileurl;
    filename = fileurl.substring(fileurl.lastIndexOf("/") + 1);
  }

  if (extension === "zip" || extension === "html") {
    imgThumb = "📦"; // Zip/HTML file icon
  } else if (extension === "mp4") {
    imgThumb = "🎥"; // Video file icon
  }


  return (
    <div key={filename} className="preview-item">
      {imgThumb && (imgThumb.startsWith("http") || imgThumb.startsWith("/")) ? (
        <Image
          src={imgThumb}
          alt={filename}
          title={""}
          style={{
            width: "35px",
            height: "auto",
          }}
          width={24}
          height={24}
          priority
        />
      ) : (
        <div style={{ fontSize: "35px", lineHeight: "35px" }}>{imgThumb}</div>
      )}
    </div>
  );
};

export default RenderPreview;
