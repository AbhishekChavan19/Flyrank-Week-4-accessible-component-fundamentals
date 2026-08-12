import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useId,
  useEffect,
  useCallback,
  type KeyboardEvent,
} from "react";

export type ActivationMode = "automatic" | "manual";
export type TabsOrientation = "horizontal" | "vertical";

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
  activationMode: ActivationMode;
  orientation: TabsOrientation;
  registerTab: (id: string) => void;
  tabIds: string[];
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs compound components must be rendered inside <CustomTabs>");
  }
  return context;
}

// Main Tabs Container
export interface CustomTabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  activationMode?: ActivationMode;
  orientation?: TabsOrientation;
  children: React.ReactNode;
  className?: string;
}

export const CustomTabs: React.FC<CustomTabsProps> = ({
  defaultValue,
  value,
  onValueChange,
  activationMode = "automatic",
  orientation = "horizontal",
  children,
  className = "",
}) => {
  const [internalValue, setInternalValue] = useState<string>(defaultValue || "");
  const [tabIds, setTabIds] = useState<string[]>([]);
  const baseId = useId();

  const isControlled = value !== undefined;
  const activeTab = isControlled ? value : internalValue;

  const onValueChangeRef = useRef(onValueChange);
  onValueChangeRef.current = onValueChange;

  const setActiveTab = useCallback(
    (id: string) => {
      if (!isControlled) {
        setInternalValue(id);
      }
      onValueChangeRef.current?.(id);
    },
    [isControlled]
  );

  const registerTab = useCallback((id: string) => {
    setTabIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  // Set default tab if none active yet
  useEffect(() => {
    if (!activeTab && tabIds.length > 0) {
      setActiveTab(tabIds[0]);
    }
  }, [tabIds, activeTab, setActiveTab]);

  return (
    <TabsContext.Provider
      value={{
        activeTab,
        setActiveTab,
        activationMode,
        orientation,
        registerTab,
        tabIds,
        baseId,
      }}
    >
      <div className={`w-full ${className}`}>{children}</div>
    </TabsContext.Provider>
  );
};

// Tab List
export interface CustomTabListProps {
  ariaLabel: string;
  children: React.ReactNode;
  className?: string;
}

export const CustomTabList: React.FC<CustomTabListProps> = ({
  ariaLabel,
  children,
  className = "",
}) => {
  const { orientation, setActiveTab, activeTab, activationMode } = useTabsContext();
  const listRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!listRef.current) return;

    // Query all ENABLED tab buttons dynamically (automatically skipping disabled tabs)
    const enabledTabs = Array.from(
      listRef.current.querySelectorAll<HTMLButtonElement>('button[role="tab"]:not([disabled])')
    );

    if (enabledTabs.length === 0) return;

    // Find the index of the currently focused tab button
    let currentIndex = enabledTabs.findIndex((tab) => tab === document.activeElement);

    // If focus is not currently on an enabled tab, fall back to index of currently selected active tab
    if (currentIndex === -1) {
      currentIndex = enabledTabs.findIndex(
        (tab) => tab.getAttribute("data-tab-id") === activeTab
      );
      if (currentIndex === -1) currentIndex = 0;
    }

    let nextIndex = currentIndex;
    const isHorizontal = orientation === "horizontal";

    if (isHorizontal) {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        nextIndex = (currentIndex + 1) % enabledTabs.length;
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        nextIndex = (currentIndex - 1 + enabledTabs.length) % enabledTabs.length;
      } else if (event.key === "Home") {
        event.preventDefault();
        nextIndex = 0;
      } else if (event.key === "End") {
        event.preventDefault();
        nextIndex = enabledTabs.length - 1;
      } else {
        return;
      }
    } else {
      // Vertical orientation arrow key rules
      if (event.key === "ArrowDown") {
        event.preventDefault();
        nextIndex = (currentIndex + 1) % enabledTabs.length;
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        nextIndex = (currentIndex - 1 + enabledTabs.length) % enabledTabs.length;
      } else if (event.key === "Home") {
        event.preventDefault();
        nextIndex = 0;
      } else if (event.key === "End") {
        event.preventDefault();
        nextIndex = enabledTabs.length - 1;
      } else {
        return;
      }
    }

    const targetTabEl = enabledTabs[nextIndex];
    if (!targetTabEl) return;

    // Focus target tab element
    targetTabEl.focus();

    // In automatic mode, focusing the tab selects it immediately
    if (activationMode === "automatic") {
      const targetValue = targetTabEl.getAttribute("data-tab-id");
      if (targetValue) {
        setActiveTab(targetValue);
      }
    }
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={ariaLabel}
      aria-orientation={orientation}
      onKeyDown={handleKeyDown}
      className={`flex ${
        orientation === "vertical"
          ? "flex-col border-r border-slate-800 pr-2 space-y-1"
          : "flex-row border-b border-slate-800 space-x-1"
      } ${className}`}
    >
      {children}
    </div>
  );
};

// Single Tab
export interface CustomTabProps {
  value: string;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const CustomTab: React.FC<CustomTabProps> = ({
  value,
  disabled = false,
  children,
  className = "",
}) => {
  const { activeTab, setActiveTab, registerTab, activationMode, baseId } = useTabsContext();

  useEffect(() => {
    registerTab(value);
  }, [value, registerTab]);

  const isSelected = activeTab === value;
  const tabId = `tab-${baseId}-${value}`;
  const panelId = `panel-${baseId}-${value}`;

  const handleClick = () => {
    if (!disabled) {
      setActiveTab(value);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    // In manual activation mode, Space or Enter activates the focused tab
    if (activationMode === "manual" && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      setActiveTab(value);
    }
  };

  return (
    <button
      type="button"
      id={tabId}
      role="tab"
      aria-selected={isSelected}
      aria-controls={panelId}
      tabIndex={isSelected && !disabled ? 0 : -1}
      disabled={disabled}
      data-tab-id={value}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`px-4 py-2.5 text-sm font-medium transition-all duration-200 outline-none rounded-lg text-left ${
        isSelected
          ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm"
          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
      } ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"} ${className}`}
    >
      {children}
    </button>
  );
};

// Single Tab Panel
export interface CustomTabPanelProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const CustomTabPanel: React.FC<CustomTabPanelProps> = ({
  value,
  children,
  className = "",
}) => {
  const { activeTab, baseId } = useTabsContext();
  const isSelected = activeTab === value;

  const tabId = `tab-${baseId}-${value}`;
  const panelId = `panel-${baseId}-${value}`;

  if (!isSelected) return null;

  return (
    <div
      id={panelId}
      role="tabpanel"
      aria-labelledby={tabId}
      tabIndex={0}
      className={`p-4 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg animate-in fade-in-50 duration-150 ${className}`}
    >
      {children}
    </div>
  );
};
