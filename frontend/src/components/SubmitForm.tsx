import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Cropper, CropperPreviewRef, CropperRef } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';
import axios from "axios";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  picture: z
    .any()
    .refine((file) => file && file[0] instanceof File, {
      message: "Please upload a file.",
    })
    .refine((file) => file && file[0].size <= 5 * 1024 * 1024, {
      message: "File size must be less than 5MB.",
    })
    .refine((file) => file && ["image/jpeg", "image/png"].includes(file[0].type), {
      message: "Only .jpg and .png files are accepted.",
    }),
});

type SubmitFormProps = {
  previewRef: React.RefObject<CropperPreviewRef>;
  setImagePreview: React.Dispatch<React.SetStateAction<string | null>>;
  setPredictedText: React.Dispatch<React.SetStateAction<string | null>>; // Add setPredictedText prop
};

const SubmitForm = ({ previewRef, setImagePreview, setPredictedText }: SubmitFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      picture: "",
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setLocalImagePreview] = useState<string | null>(null);
  const cropperRef = useRef<CropperRef>(null);

  const onSubmit = async () => {
    if (cropperRef.current) {
      const cropper = cropperRef.current;
      const canvas = cropper.getCanvas();

      if (canvas) {
        canvas.toBlob(async (blob) => {
          if (blob) {
            const formData = new FormData();
            formData.append("image", blob, "cropped-image.png");

            try {
              const response = await axios.post<{ predicted_text: string }>(
                "http://localhost:5000/predict",
                formData,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                }
              );
              setPredictedText(response.data.predicted_text); // Set predictedText with response data
            } catch (error) {
              console.error("Error:", error);
            }
          }
        }, "image/png");
      }
    }
  };

  const onReset = () => {
    form.reset();
    setLocalImagePreview(null);
    setImagePreview(null); // Reset image preview in ResultViewer
    setPredictedText(null); // Reset predicted text
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles[0]) {
      form.setValue("picture", acceptedFiles);
      const previewURL = URL.createObjectURL(acceptedFiles[0]);
      setLocalImagePreview(previewURL);
      setImagePreview(previewURL); // Set image preview for ResultViewer
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
    }
  });

  // const onChange = (cropper: CropperRef) => {
  //   console.log(cropper.getCoordinates(), cropper.getCanvas());
  // };

  const onUpdate = (cropper: CropperRef) => {
    previewRef.current?.update(cropper);
  };

  return (
    <div className="flex items-center justify-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="picture"
            render={() => (
              <FormItem>
                <FormLabel className="flex mb-8 font-bold text-2xl w-full">Upload Prescription Image</FormLabel>
                <FormControl>
                  {!imagePreview ? ( 
                    <div
                      {...getRootProps()}
                      className={`flex items-center justify-center border-2 border-dashed min-h-96 min-w-96 cursor-pointer bg-green-900 ${
                        isDragActive ? "bg-gray-200" : ""
                      }`}
                    >
                      <input {...getInputProps()} />
                      {isDragActive ? (
                        <p>Drop the file here...</p>
                      ) : (
                        <div className="text-center">
                          <label className="font-semibold text-base">
                            Drag & Drop a File Here, Or<br />
                          <span className="bg-slate-100 text-black px-2 py-0.5 rounded-sm cursor-pointer">Click Here</span>
                        </label>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-96 w-96 border-2 border-dashed p-2">
                      <Cropper
                        ref={cropperRef}
                        src={imagePreview}
                        stencilProps={{
                          grid: true,
                        }}
                        defaultCoordinates={{
                          left: 100,
                          top: 100,
                          width: 400,
                          height: 100,
                        }}
                        //onChange={onChange}
                        onUpdate={onUpdate}
                        className="cropper object-cover rounded h-full w-full"
                      />
                    </div>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex space-x-4">
            <Button type="submit">Read</Button>
            <Button type="button" onClick={onReset} variant="secondary">
              Reset
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SubmitForm;
