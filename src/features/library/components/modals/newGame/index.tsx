import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguageContext } from "@/contexts/I18N";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import NewGameMetadataForm from "./forms/metadata";
import NewGameSettingsForm from "./forms/settings";
import { NewGameFormSchema, newGameFormSchema } from "./schema";

const NewGameModal = () => {
  const { t } = useLanguageContext();
  const form = useForm<NewGameFormSchema>({
    resolver: zodResolver(newGameFormSchema),
  });

  const onSubmit = (data: NewGameFormSchema) => {
    console.log(data);
  };

  return (
    <DialogContent className="min-w-52 min-h-[30rem]">
      <Tabs defaultValue="metadata" className="w-full">
        <DialogHeader className="space-y-4">
          <DialogTitle>{t("new_game")}</DialogTitle>

          <TabsList className="w-full">
            <TabsTrigger value="metadata" className="flex-1">
              Metadata
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex-1">
              Settings
            </TabsTrigger>
          </TabsList>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col justify-between mt-3"
            autoComplete={"off"}
          >
            <TabsContent value="metadata">
              <NewGameMetadataForm form={form} />
            </TabsContent>
            <TabsContent value="settings">
              <NewGameSettingsForm form={form} />
            </TabsContent>
          </form>
        </Form>
      </Tabs>
      <div className="flex items-end justify-between flex-1 mt-4">
        <Button variant={"secondary"}>Import from igdb</Button>
        <Button
          type="submit"
          variant="secondary"
          onClick={form.handleSubmit(onSubmit)}
        >
          {t("add_game")}
        </Button>
      </div>
    </DialogContent>
  );
};

export default NewGameModal;
