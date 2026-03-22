import React, { useState } from 'react'
import { Sparkles, Upload, ImagePlus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export default function AIDesignGenerator({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f || !f.type.startsWith('image/')) return
    setFile(f)
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result as string)
    reader.readAsDataURL(f)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f?.type.startsWith('image/')) {
      setFile(f)
      const reader = new FileReader()
      reader.onload = () => setPreview(reader.result as string)
      reader.readAsDataURL(f)
    }
  }

  const handleGenerate = () => {
    if (!file) return
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      onOpenChange(false)
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-highlight" />
            AI Design Generator
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Upload a photo of your room and get AI-generated interior design ideas. Supports JPG and PNG.
          </p>

          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-highlight/50 transition-colors cursor-pointer"
            onClick={() => document.getElementById('ai-upload')?.click()}
          >
            <input
              id="ai-upload"
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleFileChange}
              className="hidden"
            />
            {preview ? (
              <img src={preview} alt="Upload" className="max-h-48 mx-auto rounded-lg object-cover" />
            ) : (
              <>
                <Upload className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">Drag & drop or click to upload</p>
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG · Good quality recommended</p>
              </>
            )}
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!file || isProcessing}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <span className="animate-pulse">Generating design ideas…</span>
              </>
            ) : (
              <>
                <ImagePlus className="w-4 h-4 mr-2" />
                Generate Design Ideas
              </>
            )}
          </Button>

          <p className="text-[10px] text-muted-foreground text-center">
            AI Design Generator uses advanced algorithms to suggest furniture placement and styles. Results may vary.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
