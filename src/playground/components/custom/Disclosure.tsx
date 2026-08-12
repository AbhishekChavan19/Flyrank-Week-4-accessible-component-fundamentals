import React, { useState, useId, useRef, type KeyboardEvent } from "react";
import { ChevronDown } from "lucide-react";

// Standard Single Disclosure Component
export interface CustomDisclosureProps {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  isExpanded?: boolean;
  onToggle?: (expanded: boolean) => void;
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  disabled?: boolean;
  className?: string;
}

export const CustomDisclosure: React.FC<CustomDisclosureProps> = ({
  title,
  children,
  defaultExpanded = false,
  isExpanded,
  onToggle,
  headingLevel = 3,
  disabled = false,
  className = "",
}) => {
  const [internalExpanded, setInternalExpanded] = useState<boolean>(defaultExpanded);
  const uniqueId = useId();

  const isControlled = isExpanded !== undefined;
  const expanded = isControlled ? isExpanded : internalExpanded;

  const triggerId = `disclosure-trigger-${uniqueId}`;
  const panelId = `disclosure-panel-${uniqueId}`;

  const handleToggle = () => {
    if (disabled) return;
    const nextState = !expanded;
    if (!isControlled) {
      setInternalExpanded(nextState);
    }
    onToggle?.(nextState);
  };

  const triggerButton = (
    <button
      type="button"
      id={triggerId}
      aria-expanded={expanded}
      aria-controls={panelId}
      disabled={disabled}
      onClick={handleToggle}
      className={`w-full flex items-center justify-between p-4 text-left font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
        disabled
          ? "opacity-50 cursor-not-allowed text-slate-500"
          : "text-slate-100 hover:bg-slate-800/50 cursor-pointer"
      }`}
    >
      <span className="text-base">{title}</span>
      <ChevronDown
        className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
          expanded ? "transform rotate-180 text-blue-400" : ""
        }`}
      />
    </button>
  );

  const headingElement = React.createElement(
    `h${headingLevel}`,
    { className: "m-0 p-0" },
    triggerButton
  );

  return (
    <div className={`border border-slate-800 rounded-xl bg-slate-900/60 overflow-hidden ${className}`}>
      {headingElement}

      {expanded && (
        <div
          id={panelId}
          role="region"
          aria-labelledby={triggerId}
          className="p-4 pt-0 text-slate-300 text-sm leading-relaxed border-t border-slate-800/40 animate-in fade-in-50 duration-150"
        >
          {children}
        </div>
      )}
    </div>
  );
};

// Accordion Group Container Component
export interface CustomAccordionItem {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface CustomAccordionProps {
  items: CustomAccordionItem[];
  allowMultiple?: boolean;
  defaultExpandedIds?: string[];
  className?: string;
}

export const CustomAccordion: React.FC<CustomAccordionProps> = ({
  items,
  allowMultiple = false,
  defaultExpandedIds = [],
  className = "",
}) => {
  const [expandedIds, setExpandedIds] = useState<string[]>(defaultExpandedIds);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleItem = (id: string) => {
    setExpandedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      return allowMultiple ? [...prev, id] : [id];
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;

    // Get enabled trigger buttons only
    const triggers = Array.from(
      containerRef.current?.querySelectorAll<HTMLButtonElement>("button[aria-expanded]:not([disabled])") || []
    );
    if (triggers.length === 0) return;

    const currentIndex = triggers.findIndex((btn) => btn === document.activeElement);
    if (currentIndex === -1) return;

    let targetIndex = currentIndex;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      targetIndex = (currentIndex + 1) % triggers.length;
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      targetIndex = (currentIndex - 1 + triggers.length) % triggers.length;
    } else if (event.key === "Home") {
      event.preventDefault();
      targetIndex = 0;
    } else if (event.key === "End") {
      event.preventDefault();
      targetIndex = triggers.length - 1;
    }

    triggers[targetIndex]?.focus();
  };

  return (
    <div ref={containerRef} onKeyDown={handleKeyDown} className={`space-y-3 ${className}`}>
      {items.map((item) => (
        <CustomDisclosure
          key={item.id}
          title={item.title}
          disabled={item.disabled}
          isExpanded={expandedIds.includes(item.id)}
          onToggle={() => toggleItem(item.id)}
        >
          {item.content}
        </CustomDisclosure>
      ))}
    </div>
  );
};
