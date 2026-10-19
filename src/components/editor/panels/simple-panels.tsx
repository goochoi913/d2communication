"use client";

import { useRef, useState } from "react";
import { LuEye, LuEyeOff, LuImagePlus, LuLink, LuLoaderCircle, LuTrash2 } from "react-icons/lu";
import { toast } from "sonner";

import { tr } from "@/content/format";
import type { CategorySlug, Partner, Visibility } from "@/content/schema";
import { pagePath } from "@/content/select";
import { PartnerMark } from "@/components/site/partner-mark";
import { Button } from "@/components/ui/button";
import { useEditor, useUi } from "../context";
import { deleteItem } from "../editable-item";
import { useImageReplace } from "../editable-image";
import { Choice, Field, L10nField, Panel, SwitchRow, TextInput } from "../fields";
import { uploadLogo } from "../media/upload";

export function CategoryPanel({ slug, onClose }: { slug: CategorySlug; onClose: () => void }) {
  const { state, store, lang } = useEditor();
  const t = useUi();
  const category = state.draft.categories.find((c) => c.slug === slug);
  const input = useRef<HTMLInputElement>(null);
  const { replace, progress } = useImageReplace();
  if (!category) return null;
  const at = (...keys: string[]) => ["categories", `#${slug}`, ...keys];
  const url = `${window.location.origin}${pagePath(lang, slug)}`;

  return (
    <Panel title={tr(category.name, lang)} onClose={onClose} footer={<Button className="h-11 w-full" onClick={onClose}>{t("done")}</Button>}>
      <Field label={t("visibility")}>
        <Choice<Visibility>
          value={category.visibility}
          onChange={(v) => store.update(at("visibility"), v)}
          options={[
            { value: "public", label: t("visPublic"), hint: t("visPublicHint"), icon: <LuEye className="size-4" /> },
            { value: "link-only", label: t("visLink"), hint: t("visLinkHint"), icon: <LuLink className="size-4" /> },
            { value: "hidden", label: t("visHidden"), hint: t("visHiddenHint"), icon: <LuEyeOff className="size-4" /> },
          ]}
        />
      </Field>
      <Button
        variant="outline"
        className="h-11 justify-self-start"
        onClick={async () => {
          await navigator.clipboard.writeText(url).catch(() => {});
          toast.success(t("linkCopied"));
        }}
      >
        <LuLink className="size-4" />
        {t("copyLink")}
      </Button>
      <L10nField label={t("name")} path={at("name")} value={category.name} />
      <L10nField label={t("tagline")} path={at("tagline")} value={category.tagline} />
      <L10nField label={t("description")} path={at("description")} value={category.description} multiline />
      <Field label={t("cover")}>
        <Button variant="outline" className="h-11 justify-self-start" onClick={() => input.current?.click()} disabled={progress !== null}>
          {progress !== null ? <LuLoaderCircle className="size-4 animate-spin" /> : <LuImagePlus className="size-4" />}
          {progress !== null ? `${Math.round(progress * 100)}%` : t("replacePhoto")}
        </Button>
        <input
          ref={input}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            if (f) void replace(f, at("cover"), "cover");
          }}
        />
      </Field>
    </Panel>
  );
}

export function PhotoPanel({ id, onClose }: { id: string; onClose: () => void }) {
  const { state, store, lang, confirm } = useEditor();
  const t = useUi();
  const photo = state.draft.photos.find((p) => p.id === id);
  const input = useRef<HTMLInputElement>(null);
  const { replace, progress } = useImageReplace();
  if (!photo) return null;
  const at = (...keys: string[]) => ["photos", `#${id}`, ...keys];

  const remove = async () => {
    const ok = await confirm({ title: t("deleteTitle", { name: tr(photo.caption, lang) || t("sample") }), body: t("deleteBody"), confirm: t("delete"), destructive: true });
    if (!ok) return;
    store.mutate((c) => deleteItem(c, "photo", ["photos"], id));
    toast(t("deleted"), { action: { label: t("undo"), onClick: store.undo } });
    onClose();
  };

  return (
    <Panel
      title={tr(photo.caption, lang) || t("caption")}
      onClose={onClose}
      footer={
        <div className="flex items-center justify-between gap-3">
          <Button variant="ghost" className="h-11 text-[#EA4E4E] hover:bg-[#CC0606]/15 hover:text-[#EA4E4E]" onClick={remove}>
            <LuTrash2 className="size-4" />
            {t("deletePhoto")}
          </Button>
          <Button className="h-11 px-6" onClick={onClose}>
            {t("done")}
          </Button>
        </div>
      }
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photo.image.src.replace("{w}", String(photo.image.widths?.[0] ?? ""))} alt="" className="max-h-72 w-full rounded-sm object-contain" />
      <Button variant="outline" className="h-11 justify-self-start" onClick={() => input.current?.click()} disabled={progress !== null}>
        {progress !== null ? <LuLoaderCircle className="size-4 animate-spin" /> : <LuImagePlus className="size-4" />}
        {progress !== null ? `${Math.round(progress * 100)}%` : t("replacePhoto")}
      </Button>
      <input
        ref={input}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (f) void replace(f, at("image"), "photo");
        }}
      />
      <L10nField label={t("caption")} path={at("caption")} value={photo.caption} />
      <Field label={t("group")}>
        <Choice
          value={photo.group}
          onChange={(v) => store.update(at("group"), v)}
          options={[
            { value: "portfolio", label: tr(state.draft.text["photography.portfolio"], lang) },
            { value: "location", label: tr(state.draft.text["photography.location"], lang) },
          ]}
        />
      </Field>
      <SwitchRow label={t("hide")} checked={!!photo.hidden} onChange={(v) => store.update(at("hidden"), v || undefined)} />
    </Panel>
  );
}

export function PartnerPanel({ id, onClose }: { id: string; onClose: () => void }) {
  const { state, store, lang, confirm } = useEditor();
  const t = useUi();
  const partner = state.draft.partners.find((p) => p.id === id);
  const input = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  if (!partner) return null;
  const at = (...keys: string[]) => ["partners", `#${id}`, ...keys];
  const set = (key: keyof Partner, value: unknown) => store.update(at(key), value);

  const remove = async () => {
    const ok = await confirm({ title: t("deleteTitle", { name: tr(partner.name, lang) }), body: t("deleteBody"), confirm: t("delete"), destructive: true });
    if (!ok) return;
    store.mutate((c) => deleteItem(c, "partner", ["partners"], id));
    toast(t("deleted"), { action: { label: t("undo"), onClick: store.undo } });
    onClose();
  };

  return (
    <Panel
      title={tr(partner.name, lang)}
      description={t("logoHint")}
      onClose={onClose}
      footer={
        <div className="flex items-center justify-between gap-3">
          <Button variant="ghost" className="h-11 text-[#EA4E4E] hover:bg-[#CC0606]/15 hover:text-[#EA4E4E]" onClick={remove}>
            <LuTrash2 className="size-4" />
            {t("deletePartner")}
          </Button>
          <Button className="h-11 px-6" onClick={onClose}>
            {t("done")}
          </Button>
        </div>
      }
    >
      <div className="group/partner grid h-32 place-items-center rounded-sm bg-neutral-900 ring-1 ring-white/10">
        <PartnerMark partner={partner} lang={lang} height={40} interactive />
      </div>
      <Button variant="outline" className="h-11 justify-self-start" onClick={() => input.current?.click()} disabled={uploading}>
        {uploading ? <LuLoaderCircle className="size-4 animate-spin" /> : <LuImagePlus className="size-4" />}
        {t("uploadLogo")}
      </Button>
      <input
        ref={input}
        type="file"
        accept="image/svg+xml,image/png,image/jpeg,image/webp,.svg"
        className="hidden"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (!f) return;
          setUploading(true);
          try {
            set("logo", await uploadLogo(f));
          } catch {
            toast.error(t("uploadFailed"));
          } finally {
            setUploading(false);
          }
        }}
      />
      <L10nField label={t("partnerName")} path={at("name")} value={partner.name} />
      <Field label={t("logoStyle")}>
        <Choice
          value={partner.mono ?? "silhouette"}
          onChange={(v) => set("mono", v)}
          options={[
            { value: "silhouette", label: t("logoSilhouette") },
            { value: "invert", label: t("logoInvert") },
          ]}
        />
      </Field>
      <SwitchRow label={t("hoverColor")} checked={!!partner.hoverColor} onChange={(v) => set("hoverColor", v)} />
      <SwitchRow label={t("hide")} checked={!!partner.hidden} onChange={(v) => set("hidden", v || undefined)} />
      <Field label={t("website")}>
        <TextInput value={partner.url ?? ""} inputMode="url" placeholder="https://…" onCommit={(v) => set("url", v || undefined)} />
      </Field>
    </Panel>
  );
}
