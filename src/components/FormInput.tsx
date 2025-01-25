import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TextAnimate } from "./ui/text-animate";

type FormInputProps = {
  name:
    | "temperature"
    | "humidity"
    | "moisture"
    | "soil_type"
    | "crop_type"
    | "nitrogen"
    | "potassium"
    | "phosphorous";
  lab: string;
  placeholder: string;
  control: any; // Pass control from react-hook-form
};

const FormInput: React.FC<FormInputProps> = ({
  name,
  lab,
  placeholder,
  control,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex items-center justify-center mt-4">
          <div className="flex flex-col items-center text-center">
            <FormLabel className="text-md font-semibold mr-10 ml-10">
              <TextAnimate animation="blurInUp" by="text">
                {lab}
              </TextAnimate>
            </FormLabel> 
          </div>
          <FormControl className="w-full mr-10">
            <Input
              placeholder={placeholder}
              {...field}
              className="hover:shadow"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormInput;
