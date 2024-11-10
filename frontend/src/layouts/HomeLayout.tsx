import { useRef, useState } from "react";
import ResultViewer from "@/components/ResultViewer";
import SubmitForm from "@/components/SubmitForm";
import { Separator } from "@/components/ui/separator";
import { CropperPreviewRef } from 'react-advanced-cropper';

const HomeLayout = () => {
  const previewRef = useRef<CropperPreviewRef>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [predictedText, setPredictedText] = useState<string | null>(null); // Add predictedText state

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex-1 flex flex-col items-center justify-center basis-1/2">
        <SubmitForm
          previewRef={previewRef}
          setImagePreview={setImagePreview}
          setPredictedText={setPredictedText} // Pass setPredictedText to SubmitForm
        />
      </div>
      <Separator orientation="vertical" className="flex h-4/5" />
      <div className="flex-1 flex flex-col items-center justify-center basis-1/2">
        <ResultViewer
          previewRef={previewRef}
          imagePreview={imagePreview}
          predictedText={predictedText} // Pass predictedText to ResultViewer
        />
      </div>
    </div>
  );
};

export default HomeLayout;
