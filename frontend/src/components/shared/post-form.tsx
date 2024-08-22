import React, { useRef, useState, ChangeEvent, FormEvent } from "react";
import UserAvatar from "../ui/user-avatar";
import { postService } from "@/data/post.service";
import { useAuthContext } from "@/context/authContext";
import { Textarea } from "../ui/textarea";
import { toast } from "react-toastify";

interface PostFormProps {
  className?: string;
}

const PostForm: React.FC<PostFormProps> = ({ className }) => {
  const [text, setText] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const imageRef = useRef<HTMLInputElement | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
  const { user } = useAuthContext();

  const clearForm = () => {
    setText("");
    if (imageRef.current) {
      imageRef.current.value = "";
    }
    setSelectedImage(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (text.length === 0 && !selectedImage) return;

    setIsPending(true);

    try {
      await postService.createPost({ content: text, mediaFile: selectedImage });
      postService.useGetUserFeed().mutate()
      clearForm();
    } catch (error) {
      toast.error("Failed to create post");
      console.error("Failed to create post:", error);
    } finally {
      setIsPending(false);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImage(e.target.files[0]);
    }
  };

  return (
    <div className={`bg-white text-gray-700 p-4 md:rounded-md shadow-md ${className}`}>
      <div className="flex justify-between">
        <div className="flex items-center">
          <UserAvatar name="Profile" isProfile={true} />
          <div className="flex flex-col ml-3 gap-y-1">
            <span className="text-sm">{user.name}</span>
          </div>
        </div>
      </div>
      <div>
        <form className="max-h-[300px] mt-4 overflow-y-auto" onSubmit={handleSubmit}>
          <Textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Write some text"
          />
          {selectedImage && (
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
                alt="Remove"
              />
              <img
                className="rounded-lg mt-4"
                src={URL.createObjectURL(selectedImage)}
                alt="Selected"
              />
            </div>
          )}
          <div className="flex justify-between items-center mt-4">
            <div>
              <label className="cursor-pointer" htmlFor="image">
                <img
                  width="40"
                  height="40"
                  src="https://img.icons8.com/color/48/add-image.png"
                  alt="Add image"
                />
              </label>
              <input
                disabled={isPending}
                ref={imageRef}
                onChange={handleImageChange}
                id="image"
                name="image"
                type="file"
                accept="image/*"
                className="hidden"
              />
            </div>
            <input
              disabled={isPending}
              className="py-2 px-4 bg-blue-500 rounded-md text-white hover:bg-blue-600 transition mt-4 disabled:bg-slate-600 disabled:text-white"
              type="submit"
              value={isPending ? "Posting..." : "Post"}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostForm;
