import { TextAnimate } from "./ui/text-animate";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "./FormInput";
import axios from "axios";
import { useState } from "react";

const formSchema = z.object({
  temperature: z.string().nonempty("Temperature must be non-negative"),
  humidity: z.string().nonempty("Humidity must be non-negative"),
  moisture: z.string().nonempty("Moisture must be non-negative"),
  soil_type: z.string().nonempty("Soil type is required"),
  crop_type: z.string().nonempty("Crop type is required"),
  nitrogen: z.string().nonempty("Nitrogen must be non-negative"),
  potassium: z.string().nonempty("Potassium must be non-negative"),
  phosphorous: z.string().nonempty("Phosphorous must be non-negative"),
});

const Fert_Recommedations = () => {
  const [result, setResult] = useState("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      temperature: "",
      humidity: "",
      moisture: "",
      soil_type: "",
      crop_type: "",
      nitrogen: "",
      potassium: "",
      phosphorous: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log("Control Reached in the Try part", values);
      const response = await axios.post(
        "http://127.0.0.1:8000/fertilizer_recommendation",
        values
      );
      setResult(response.data.recommended_fertilizer);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
      <div className="flex flex-col items-center text-center">
        <div className="text-4xl font-semibold text-gray-800 mb-6">
          <TextAnimate animation="blurInUp" by="text">
            Fertilizer Recommendation
          </TextAnimate>
        </div>
        <div className="text-lg text-gray-700 mb-6">
          <TextAnimate animation="blurInUp" by="text">
            Optimize crop growth with tailored fertilizer recommendations for
            healthier yields and sustainable farming.
          </TextAnimate>
        </div>
        <div className="border w-full p-4 rounded-xl shadow">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormInput
                name="temperature"
                lab="Temperature"
                placeholder="Enter the Temperature"
                control={form.control}
              />
              <FormInput
                name="humidity"
                lab="Humidity"
                placeholder="Enter the Percentage Humidity"
                control={form.control}
              />
              <FormInput
                name="moisture"
                lab="Moisture"
                placeholder="Enter the Percentage Moisture"
                control={form.control}
              />
              <FormInput
                name="crop_type"
                lab="Crop Type"
                placeholder="What is the Crop Type"
                control={form.control}
              />
              <FormInput
                name="soil_type"
                lab="Soil Type"
                placeholder="What is the Soil Type"
                control={form.control}
              />
              <FormInput
                name="nitrogen"
                lab="Nitrogen"
                placeholder="Enter the Percentage of Nitrogen"
                control={form.control}
              />
              <FormInput
                name="potassium"
                lab="Potassium"
                placeholder="Enter the Percentage of Potassium"
                control={form.control}
              />
              <FormInput
                name="phosphorous"
                lab="Phosphorous"
                placeholder="Enter the Percentage of Phosphorous"
                control={form.control}
              />
              <Button type="submit" className="mb-4 mt-4">
                Submit
              </Button>
            </form>
          </Form>
          {result && (
            <div className="mt-6 p-4 bg-gradient-to-br from-green-70 to-blue-70 border rounded-xl shadow">
              <h2 className="text-xl font-bold mb-2">Recommendation:</h2>
              <p>{result}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Fert_Recommedations;
