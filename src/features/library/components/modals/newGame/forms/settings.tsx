import { FormField } from "@/components/ui/form";
import { useLanguageContext } from "@/contexts/I18N";
import { UseFormReturn } from "react-hook-form";
import GameFormInput from "../../../gameFormInput";
import { NewGameFormSchema } from "../schema";

interface NewGameMetadataFormProps {
  form: UseFormReturn<NewGameFormSchema>;
}

const NewGameSettingsForm = ({ form }: NewGameMetadataFormProps) => {
  const { t } = useLanguageContext();

  return (
    <div className="flex flex-col flex-1 gap-2.5">
      <FormField
        control={form.control}
        name="gameArgs"
        render={({ field }) => (
          <GameFormInput
            text={t("arguments")}
            description={t("the_arguments_to_pass_to_the_game")}
            field={field}
          />
        )}
      />

      <FormField
        control={form.control}
        name="gameCommand"
        render={({ field }) => (
          <GameFormInput
            text={t("command")}
            description={t("the_command_to_run_the_game_e_g_wine")}
            field={field}
          />
        )}
      />
    </div>
  );
};

export default NewGameSettingsForm;
