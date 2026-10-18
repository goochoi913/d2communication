import { OptionSwitcher } from "@/components/demo/option-switcher";

export default function OptionsLayout({ children }: LayoutProps<"/options">) {
  return (
    <>
      {children}
      <OptionSwitcher />
    </>
  );
}
