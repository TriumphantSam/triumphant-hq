import { siteIdentity } from "@/lib/seo";

/** Text links in the same inline pattern as the footer email and WhatsApp links. */
export default function ProfileLinks({
  linkClassName,
  separatorClassName = "text-slate-400",
}: {
  linkClassName: string;
  separatorClassName?: string;
}) {
  return (
    <>
      {siteIdentity.profiles.map((profile, index) => (
        <span key={profile.href}>
          {index > 0 ? <span className={separatorClassName}> · </span> : null}
          <a href={profile.href} target="_blank" rel="noreferrer" className={linkClassName}>
            {profile.label}
          </a>
        </span>
      ))}
    </>
  );
}
