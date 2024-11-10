import { CropperPreview, CropperPreviewRef } from 'react-advanced-cropper';

type ResultViewerProps = {
  previewRef: React.RefObject<CropperPreviewRef>;
  imagePreview: string | null;
  predictedText: string | null; // Add predictedText prop
};

const ResultViewer = ({ previewRef, imagePreview, predictedText }: ResultViewerProps) => {
  return (
    <div className="flex-col flex">
      <label className="flex font-bold mb-8 text-2xl w-full">Drug Details</label>
      <div className="flex items-center mb-6 justify-center min-h-24 min-w-96 border-2 border-dashed bg-green-900">
        {imagePreview && (
          <CropperPreview
            ref={previewRef}
            className="object-cover rounded max-h-24 max-w-96 p-2"
          />
        )}
      </div>
      <label className="flex font-bold mb-4 text-lg w-full">Predicted Result:</label>
      <div className='flex items-center justify-center min-h-72 min-w-96 border-2 border-dashed bg-green-900'>
        <label className='text-xl font-semibold'>{predictedText || "No prediction yet"}</label> {/* Display predictedText */}
      </div>
    </div>
  );
};

export default ResultViewer;
