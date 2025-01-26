import { useForm } from "react-hook-form";
import { TextAnimate } from "./ui/text-animate";
import { z } from "zod";
import { Form } from "./ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "./FormInput";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const formSchema = z.object({
  temperature: z
    .string()
    .nonempty("Temperature should be a non-negative value"),
  nitrogen: z.string().nonempty("Nitrogen should be a non-negative value"),
  humidity: z.string().nonempty("Humidity should be a non-negative value"),
  ph: z.string().nonempty("pH should be a non-negative value"),
  potassium: z.string().nonempty("Potassium should be a non-negative value"),
  phosphorus: z.string().nonempty("Phosphorus should be a non-negative value"),
  rainfall: z.string().nonempty("Rainfall should be a non-negative value"),
});

export default function CropRecommendations() {
  const [result, setResult] = useState("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      temperature: "",
      nitrogen: "",
      humidity: "",
      ph: "",
      potassium: "",
      phosphorus: "",
      rainfall: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Convert form values to numbers where necessary
    const payload = {
      ...values,
      temperature: parseFloat(values.temperature),
      nitrogen: parseFloat(values.nitrogen),
      humidity: parseFloat(values.humidity),
      ph: parseFloat(values.ph),
      potassium: parseFloat(values.potassium),
      phosphorus: parseFloat(values.phosphorus),
      rainfall: parseFloat(values.rainfall),
    };

    try {
      console.log("Payload:", payload);
      const response = await axios.post(
        "http://127.0.0.1:8000/crop_recommendation",
        payload
      );
      console.log("Response:", response.data);
      setResult(response.data.recommended_crop);
    } catch (error) {
      console.error("Error hitting the endpoint:", error);
    }
  };

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center text-center">
          <div className="flex flex-row">
            <Link
              to="/"
              className="inline-flex items-center text-green-600 hover:text-green-700 mb-8 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </div>
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-sm shadow">
            <div className="text-4xl font-semibold mb-4 mt-4 text-white">
              <TextAnimate animation="blurInUp" by="text">
                Crop Recommendation
              </TextAnimate>
            </div>
            <div className="text-lg text-gray-700 mb-6 text-white ml-2 mr-2">
              <TextAnimate animation="blurInUp" by="text">
                Crop Recommendation provides tailored suggestions for the best
                crops to cultivate based on soil, weather,
              </TextAnimate>
              <TextAnimate animation="blurInUp" by="text">
                and environmental conditions, optimizing yield and
                sustainability
              </TextAnimate>
            </div>
          </div>

          <div className="border shadow-2xl rounded-md w-full">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormInput
                  name="temperature"
                  lab="Temperature"
                  placeholder="Enter the value of Temperature"
                  control={form.control}
                />
                <FormInput
                  name="nitrogen"
                  lab="Nitrogen"
                  placeholder="Enter the value of Nitrogen"
                  control={form.control}
                />
                <FormInput
                  name="humidity"
                  lab="Humidity"
                  placeholder="Enter the value of Humidity"
                  control={form.control}
                />
                <FormInput
                  name="ph"
                  lab="pH"
                  placeholder="Enter the value of pH"
                  control={form.control}
                />
                <FormInput
                  name="potassium"
                  lab="Potassium"
                  placeholder="Enter the value of Potassium"
                  control={form.control}
                />
                <FormInput
                  name="phosphorus"
                  lab="Phosphorus"
                  placeholder="Enter the value of Phosphorus"
                  control={form.control}
                />
                <FormInput
                  name="rainfall"
                  lab="Rainfall"
                  placeholder="Enter the value of Rainfall"
                  control={form.control}
                />
                <Button type="submit" className="m-4">
                  Submit
                </Button>
              </form>
            </Form>
            {result && (
              <div className="flex justify-center mt-6 p-4 bg-gradient-to-br from-green-70 to-blue-70 border rounded-xl shadow">
                <TextAnimate
                  animation="blurInUp"
                  by="text"
                  className="text-xl font-semibold"
                >
                  Recommended Crop :
                </TextAnimate>
                <div className="ml-2 text-xl font-semibold">{result}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
