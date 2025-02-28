"use client";

import DashBadge from "@/app/(dashboard)/components/badge";
import { DataCardSkeleton } from "@/app/(dashboard)/components/data-card";
import DashTitle from "@/app/(dashboard)/components/title";
import { DropdownItem, DropdownSkeleton } from "@/components/default-dropdown";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { handleCopy } from "@/lib/utils";
import { useForms, useLogs } from "@/providers";
import { uppercase } from "@formhook/utils";
import { DotsHorizontalIcon, Link1Icon } from "@radix-ui/react-icons";
import SubmissionItem from "../../components/submission-item";
import { getForm, getLogVariant } from "../columns";

export default function Log({ id }: { id?: string }) {
  const { logs, isLoading } = useLogs();
  const { forms } = useForms();

  const log = logs?.find((log) => log.id === id);

  if (isLoading) return <Loading />;

  if (!log) return null;

  const form = getForm(forms, log?.submissionId || "");

  console.log(log);

  const dropdownItems = [
    {
      title: "View submission",
      url: `/forms/${form?.id}/submissions/${log.submissionId}`,
    },
    {
      title: "View form",
      url: `/forms/${form?.id}`,
    },
  ];

  return (
    <>
      <DashTitle
        title={`${uppercase(log.type)} Log`}
        indicator={<DashBadge variant={getLogVariant(log)}>{log.code}</DashBadge>}
      >
        <DropdownSkeleton
          button={
            <Button variant="outline" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          }
        >
          <DropdownItem
            item={{
              title: "Copy ID",
              icon: Link1Icon,
              onClick: () => handleCopy(log.id, "ID"),
            }}
          />

          <DropdownMenuSeparator />
          {dropdownItems.map((item) => (
            <DropdownItem key={item.title} item={item} />
          ))}
        </DropdownSkeleton>
      </DashTitle>
      <DataCardSkeleton title="Details">
        <div className="flex flex-col gap-2">
          <span className="text-[0.8rem]">{log.message ?? log.data.error ?? "No message."}</span>
        </div>
        <div className="grid gap-5 grid-cols-2 max-w-4xl">
          {Object.keys(log.data).length > 0 ? (
            Object.entries(log.data).map(([key, value]) => (
              <SubmissionItem key={key} label={`${key}:`} value={value} uppercaseLabel={false} />
            ))
          ) : (
            <SubmissionItem label="N/A" value="No data." />
          )}
          <SubmissionItem label="createdAt:" value={new Date(log.createdAt).toLocaleString()} uppercaseLabel={false} />
        </div>
      </DataCardSkeleton>
    </>
  );
}
