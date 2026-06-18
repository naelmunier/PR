"use client";
import { cn } from "../../lib/utils";

interface DisplayCardProps {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  sub?: string;
  iconClassName?: string;
  titleClassName?: string;
}

export function DisplayCard({
  className,
  icon,
  title = "Page",
  description = "Description",
  sub = "PR+",
  titleClassName = "text-primary",
}: DisplayCardProps) {
  return (
    <div
      className={cn(
        "relative flex h-36 w-[22rem] -skew-y-[8deg] select-none flex-col justify-between rounded-xl border bg-surface/80 backdrop-blur-sm px-4 py-3 transition-all duration-500",
        "after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-[10rem] after:bg-gradient-to-l after:from-bg after:to-transparent after:content-['']",
        "hover:border-primary/20 hover:bg-primary-50/60",
        "[&>*]:flex [&>*]:items-center [&>*]:gap-2",
        className
      )}
    >
      <div>
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-primary-100 border border-primary-200">
          {icon}
        </span>
        <p className={cn("text-sm font-bold", titleClassName)}>{title}</p>
      </div>
      <p className="text-sm font-medium text-ink truncate">{description}</p>
      <p className="text-xs text-ink-400">{sub}</p>
    </div>
  );
}

export default function DisplayCards({ cards }: { cards?: DisplayCardProps[] }) {
  const defaultCards: DisplayCardProps[] = [
    {
      className:
        "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-full before:h-full before:rounded-xl before:bg-bg/50 before:content-[''] before:top-0 before:left-0 grayscale-[80%] hover:grayscale-0 before:transition-opacity before:duration-500 hover:before:opacity-0",
    },
    {
      className:
        "[grid-area:stack] translate-x-16 translate-y-10 hover:-translate-y-1 before:absolute before:w-full before:h-full before:rounded-xl before:bg-bg/50 before:content-[''] before:top-0 before:left-0 grayscale-[60%] hover:grayscale-0 before:transition-opacity before:duration-500 hover:before:opacity-0",
    },
    {
      className: "[grid-area:stack] translate-x-32 translate-y-20 hover:translate-y-10",
    },
  ];

  const displayCards = cards || defaultCards;

  return (
    <div className="grid [grid-template-areas:'stack'] place-items-center animate-in fade-in-0 duration-700">
      {displayCards.map((cardProps, index) => (
        <DisplayCard key={index} {...cardProps} />
      ))}
    </div>
  );
}
