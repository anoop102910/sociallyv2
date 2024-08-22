import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { toast } from "react-toastify";
import UserAvatar from "../ui/user-avatar";
import { useAuthContext } from "@/context/authContext";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface ImageUploaderProps {
  className?: string;
  onClose: () => void;
}

export default function ImageUploader({ className, onClose }: ImageUploaderProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const imageRef = useRef<HTMLInputElement | null>(null);
  const {user} = useAuthContext();
  const username = user.name;
  const router = useRouter()

  const clearForm = () => {
    if (imageRef.current) {
      imageRef.current.value = "";
    }
    setSelectedImage(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (selectedImage) {
      try {
        console.log(selectedImage);
        const formData = new FormData();
        formData.append("image", selectedImage);
        const response = await api.post(
          "api/user/profile",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        console.log(response.data);
        clearForm();
        setLoading(false);
        toast.success("Image uploaded successfully");
        router.push("/");
      } catch (error) {
        setLoading(false);
        console.log((error as Error).message);
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div
      className={`animate-scale bg-white p-4 rounded-md shadow-md absolute top-[calc(100%-500px)] left-[calc(50%-300px)] w-[600px] z-10 h-auto ${className}`}
    >
      <div className="flex justify-between">
        <div className="flex justify-between w-full">
          <div className="flex items-center">
            <UserAvatar isProfile={true} src="" name={username || ""} />
            <div className="flex flex-col ml-3 justify-between gap-y-1">
              <span className="text-sm text-gray-600">{username}</span>
            </div>
          </div>
          <i
            onClick={onClose}
            className="fas fa-times block text-3xl cursor-pointer font-bold text-red-500"
          ></i>
        </div>
      </div>
      <div>
        <form className="max-h-[300px] overflow-y-auto" onSubmit={handleSubmit}>
          {selectedImage ? (
            <div className="relative">
              <img
                onClick={() => {
                  setSelectedImage(null);
                  if (imageRef.current) {
                    imageRef.current.value = "";
                  }
                }}
                className="cursor-pointer absolute top-1 right-1"
                width="36"
                height="36"
                src="https://img.icons8.com/parakeet/48/multiply.png"
                alt="multiply"
              />
              <img
                className="rounded-lg mt-4 -z-20"
                src={URL.createObjectURL(selectedImage)}
                alt="Selected"
              />
            </div>
          ) : (
            <div className="w-full h-[200px] border-2 border-dotted border-gray-400 rounded-md mt-5 flex justify-center items-center text-gray-400">
              Upload Your Profile
            </div>
          )}
          <div className="flex justify-between items-center mt-4">
            <div>
              <label className="cursor-pointer" htmlFor="image">
                <img
                  width="40"
                  height="40"
                  src="https://img.icons8.com/color/48/add-image.png"
                  alt="add-image"
                />
              </label>
              <input
                ref={imageRef}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSelectedImage(e.target.files ? e.target.files[0] : null)}
                id="image"
                name="image"
                type="file"
                accept="image/*"
                className="hidden"
              />
            </div>
            <input
              accept="image/*"
              className="py-2 px-4 bg-blue-500 rounded-md text-white hover:bg-blue-600 transition mt-4 disabled:bg-slate-500"
              type="submit"
              value={loading ? "Posting..." : "Post"}
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
