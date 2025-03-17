"use client";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Wand2 } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate image");
      }
      setImage(`data:image/png;base64,${data.imageUrl}`);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (!image) return;

    const link = document.createElement("a");
    link.href = image;
    link.download = "generated-image.png"; // You can customize the filename here
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4">
      <div className="flex justify-center items-center flex-col space-y-4 gap-6">
        <h1 className="text-4xl font-bold text-white">AI Image Generator</h1>
        <p className="text-gray-300">
          Transform your ideas into stunning images using AI
        </p>
        <div className="flex flex-row gap-6">
          {" "}
          <Input
            type="text"
            placeholder="Describe the image you want to generate..."
            className="text-white h-12 w-[600px]"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button
            className="bg-blue-600 hover:bg-blue-700 h-12"
            disabled={loading}
            onClick={generateImage}
          >
            {loading ? (
              "Generating..."
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate
              </>
            )}
          </Button>
        </div>
        {loading && (
          <div className="text-white text-2xl animate-pulse">
            Creating your masterpiece....
          </div>
        )}
        <Card className="w-[700] h-[700] p-6 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-xl">
              Generated Image
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Image height={512} width={512} src={image} alt="" />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              className="bg-blue-600 hover:bg-blue-700 h-12 hover: cursor-pointer"
              onClick={downloadImage}
              disabled={!image}
            >
              Download
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
