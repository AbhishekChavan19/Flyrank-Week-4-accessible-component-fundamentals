import { useState, useEffect, useRef } from "react";
import {
  ShieldCheck,
  Layers,
  BookOpen,
  CheckCircle2,
  Code2,
  Sliders,
  Terminal,
} from "lucide-react";

// Import Hand-Built Custom Components
import {
  Modal as CustomModal,
  CustomTabs,
  CustomTabList,
  CustomTab,
  CustomTabPanel,
  CustomAccordion,
  type ActivationMode,
  type TabsOrientation,
} from "@/playground/components/custom";


// Import shadcn/ui Components
import {
  Dialog as ShadcnDialog,
  DialogTrigger as ShadcnDialogTrigger,
  DialogContent as ShadcnDialogContent,
  DialogHeader as ShadcnDialogHeader,
  DialogTitle as ShadcnDialogTitle,
  DialogDescription as ShadcnDialogDescription,
  DialogFooter as ShadcnDialogFooter,
} from "@/components/ui/dialog";

import {
  Tabs as ShadcnTabs,
  TabsList as ShadcnTabsList,
  TabsTrigger as ShadcnTabsTrigger,
  TabsContent as ShadcnTabsContent,
} from "@/components/ui/tabs";

import {
  Accordion as ShadcnAccordion,
  AccordionItem as ShadcnAccordionItem,
  AccordionTrigger as ShadcnAccordionTrigger,
  AccordionContent as ShadcnAccordionContent,
} from "@/components/ui/accordion";

export function App() {
  // Demo States for Custom Modal
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const customModalInitialFocusRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({ name: "", email: "" });

  // Custom Tabs Config
  const [tabsActivationMode, setTabsActivationMode] = useState<ActivationMode>("automatic");
  const [tabsOrientation, setTabsOrientation] = useState<TabsOrientation>("horizontal");

  // Real-time Keyboard & Focus Inspector state
  const [focusedElementInfo, setFocusedElementInfo] = useState<{
    tag: string;
    id: string;
    role: string;
    ariaExpanded: string;
    tabIndex: string;
    text: string;
  }>({
    tag: "NONE",
    id: "none",
    role: "none",
    ariaExpanded: "n/a",
    tabIndex: "n/a",
    text: "No element focused yet",
  });
  const [lastKeyPressed, setLastKeyPressed] = useState<string>("None");
  const [announcementLog, setAnnouncementLog] = useState<string[]>([]);

  // Monitor active focus & keypresses across document
  useEffect(() => {
    const handleFocusChange = () => {
      const el = document.activeElement as HTMLElement | null;
      if (el && el !== document.body) {
        const info = {
          tag: el.tagName.toLowerCase(),
          id: el.id || "no-id",
          role: el.getAttribute("role") || "native",
          ariaExpanded: el.getAttribute("aria-expanded") ?? "n/a",
          tabIndex: el.getAttribute("tabindex") ?? "0",
          text: el.innerText ? el.innerText.substring(0, 30) : el.tagName,
        };
        setFocusedElementInfo(info);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      setLastKeyPressed(e.key === " " ? "Space" : e.key);
    };

    document.addEventListener("focusin", handleFocusChange);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("focusin", handleFocusChange);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const addAnnouncement = (msg: string) => {
    setAnnouncementLog((prev) => [msg, ...prev.slice(0, 4)]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* ARIA Live Region for Screen Reader Announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcementLog[0] || ""}
      </div>

      {/* Navigation Topbar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Accessible Component Fundamentals
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                  FE-05
                </span>
              </h1>
              <p className="text-xs text-slate-400">Track: Frontend AI Engineering • Week 4</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="#notes"
              className="text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-blue-400" />
              View NOTES.md
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Live Focus & Keyboard Inspector Banner */}
        <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-blue-400" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                Live A11y Focus & Keyboard Inspector
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span>Press Tab / Shift+Tab / Escape / Arrow Keys to test navigation</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 block uppercase">Last Key</span>
              <span className="text-sm font-bold font-mono text-emerald-400">{lastKeyPressed}</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 block uppercase">Focused Tag</span>
              <span className="text-sm font-bold font-mono text-blue-400">{focusedElementInfo.tag}</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 block uppercase">Role</span>
              <span className="text-sm font-bold font-mono text-purple-400">{focusedElementInfo.role}</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 block uppercase">tabIndex</span>
              <span className="text-sm font-bold font-mono text-amber-400">{focusedElementInfo.tabIndex}</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 block uppercase">aria-expanded</span>
              <span className="text-sm font-bold font-mono text-cyan-400">{focusedElementInfo.ariaExpanded}</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 truncate">
              <span className="text-[10px] font-mono text-slate-500 block uppercase">Element Text</span>
              <span className="text-sm font-medium text-slate-300 truncate block">{focusedElementInfo.text}</span>
            </div>
          </div>
        </section>

        {/* Component Demos Showcase Tabs */}
        <CustomTabs defaultValue="modal">
          <CustomTabList ariaLabel="Playground Sections" className="mb-6">
            <CustomTab value="modal">
              <span className="flex items-center gap-2">
                <Layers className="w-4 h-4" /> 1. Modal Dialog
              </span>
            </CustomTab>
            <CustomTab value="tabs">
              <span className="flex items-center gap-2">
                <Sliders className="w-4 h-4" /> 2. Tabs Pattern
              </span>
            </CustomTab>
            <CustomTab value="disclosure">
              <span className="flex items-center gap-2">
                <Code2 className="w-4 h-4" /> 3. Disclosure & Accordion
              </span>
            </CustomTab>
            <CustomTab value="notes">
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> 4. NOTES.md Comparison Report
              </span>
            </CustomTab>
          </CustomTabList>

          {/* TAB 1: MODAL DIALOG DEMO */}
          <CustomTabPanel value="modal">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Hand-Built Custom Modal Box */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                      Hand-Built Custom W3C APG
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Modal.tsx</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Custom Accessible Modal Dialog</h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6">
                    Hand-crafted React + TypeScript modal with React Portal, custom focus trap (`Tab`/`Shift+Tab`), `Escape` dismiss, body scroll lock, and explicit focus restoration to the trigger button.
                  </p>

                  <ul className="space-y-2 text-xs text-slate-300 mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Focus traps inside modal on open
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Escape key closes modal
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Restores focus to trigger button on close
                    </li>
                  </ul>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomModalOpen(true);
                      addAnnouncement("Custom Hand-Built Modal Dialog opened.");
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 font-medium text-white shadow-lg shadow-blue-600/20 transition-all outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  >
                    Open Hand-Built Modal
                  </button>
                </div>
              </div>

              {/* shadcn/ui Dialog Box */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                      shadcn/ui (Radix UI)
                    </span>
                    <span className="text-xs text-slate-400 font-mono">dialog.tsx</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">shadcn/ui Production Dialog</h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6">
                    Built on `@radix-ui/react-dialog` & `react-remove-scroll`. Features scrollbar gap layout shift protection, stacked focus containment, and animated unmounting presence.
                  </p>

                  <ul className="space-y-2 text-xs text-slate-300 mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-400" /> Scrollbar padding layout-shift prevention
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-400" /> Multi-layer nested focus scope stack
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-400" /> Exit animation presence lifecycle
                    </li>
                  </ul>
                </div>

                <div>
                  <ShadcnDialog>
                    <ShadcnDialogTrigger asChild>
                      <button
                        type="button"
                        onClick={() => addAnnouncement("shadcn/ui Dialog opened.")}
                        className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 font-medium text-white border border-slate-700 transition-all outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                      >
                        Open shadcn/ui Dialog
                      </button>
                    </ShadcnDialogTrigger>

                    <ShadcnDialogContent>
                      <ShadcnDialogHeader>
                        <ShadcnDialogTitle>shadcn/ui Accessible Dialog</ShadcnDialogTitle>
                        <ShadcnDialogDescription>
                          This dialog is powered by Radix UI Primitives. Inspect how focus is managed cleanly and how page scroll width is compensated automatically.
                        </ShadcnDialogDescription>
                      </ShadcnDialogHeader>

                      <div className="space-y-4 py-2">
                        <div>
                          <label className="text-xs font-medium text-slate-300 block mb-1">
                            User Role / Designation
                          </label>
                          <input
                            type="text"
                            placeholder="Frontend AI Engineer"
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>

                      <ShadcnDialogFooter>
                        <button
                          type="button"
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          Save Changes
                        </button>
                      </ShadcnDialogFooter>
                    </ShadcnDialogContent>
                  </ShadcnDialog>
                </div>
              </div>
            </div>

            {/* Custom Modal Rendering */}
            <CustomModal
              isOpen={isCustomModalOpen}
              onClose={() => {
                setIsCustomModalOpen(false);
                addAnnouncement("Custom Hand-Built Modal Dialog closed.");
              }}
              title="Hand-Crafted W3C ARIA Modal"
              description="Test keyboard focus trap using Tab / Shift+Tab and Escape to close."
              initialFocusRef={customModalInitialFocusRef}
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert(`Submitted: ${formData.name} - ${formData.email}`);
                  setIsCustomModalOpen(false);
                }}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="custom-input-name" className="text-xs font-medium text-slate-300 block mb-1">
                    Full Name (Auto-focused on Open)
                  </label>
                  <input
                    ref={customModalInitialFocusRef}
                    id="custom-input-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Abhishek Kumar"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="custom-input-email" className="text-xs font-medium text-slate-300 block mb-1">
                    Email Address
                  </label>
                  <input
                    id="custom-input-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="intern@flyrank.ai"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsCustomModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm text-slate-300 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm text-white font-medium shadow-md transition-colors"
                  >
                    Submit Form
                  </button>
                </div>
              </form>
            </CustomModal>
          </CustomTabPanel>

          {/* TAB 2: TABS PATTERN DEMO */}
          <CustomTabPanel value="tabs">
            <div className="space-y-8">
              {/* Controls Toolbar for Custom Tabs */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-4 text-xs font-medium text-slate-300">
                  <span>Activation Mode:</span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="activation"
                      value="automatic"
                      checked={tabsActivationMode === "automatic"}
                      onChange={() => setTabsActivationMode("automatic")}
                      className="text-blue-500 focus:ring-blue-500"
                    />
                    <span>Automatic (Focus activates tab)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="activation"
                      value="manual"
                      checked={tabsActivationMode === "manual"}
                      onChange={() => setTabsActivationMode("manual")}
                      className="text-blue-500 focus:ring-blue-500"
                    />
                    <span>Manual (Enter/Space activates tab)</span>
                  </label>
                </div>

                <div className="flex items-center space-x-4 text-xs font-medium text-slate-300">
                  <span>Orientation:</span>
                  <button
                    type="button"
                    onClick={() =>
                      setTabsOrientation((prev) => (prev === "horizontal" ? "vertical" : "horizontal"))
                    }
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700 font-mono text-blue-400"
                  >
                    Toggle: {tabsOrientation}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Hand-Built Custom Tabs */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                      Hand-Built Custom Tabs
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Roving tabIndex</span>
                  </div>

                    <CustomTabs
                    defaultValue="overview"
                    activationMode={tabsActivationMode}
                    orientation={tabsOrientation}
                    onValueChange={(val) => addAnnouncement(`Custom Tab switched to: ${val}`)}
                  >
                    <CustomTabList ariaLabel="Component Information">
                      <CustomTab value="overview">Overview</CustomTab>
                      <CustomTab value="disabled-demo" disabled>
                        Disabled Tab
                      </CustomTab>
                      <CustomTab value="keyboard">Keyboard Spec</CustomTab>
                      <CustomTab value="code">TS Source</CustomTab>
                    </CustomTabList>

                    <CustomTabPanel value="overview">
                      <h4 className="text-sm font-semibold text-white mb-1">Roving Focus Pattern</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Only the active tab has `tabIndex={0}`. Inactive tabs have `tabIndex={-1}`. Pressing Arrow Right / Down moves focus to the next tab cleanly.
                      </p>
                    </CustomTabPanel>

                    <CustomTabPanel value="keyboard">
                      <h4 className="text-sm font-semibold text-white mb-1">Supported Keys</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        `ArrowRight` / `ArrowLeft`: Navigate tabs. `Home`: Jump to first tab. `End`: Jump to last tab.
                      </p>
                    </CustomTabPanel>

                    <CustomTabPanel value="code">
                      <h4 className="text-sm font-semibold text-white mb-1">TypeScript React Context</h4>
                      <p className="text-xs text-slate-400 leading-relaxed font-mono">
                        Fully type-safe compound components sharing active state via React Context.
                      </p>
                    </CustomTabPanel>
                  </CustomTabs>
                </div>

                {/* shadcn/ui Tabs */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                      shadcn/ui Tabs
                    </span>
                    <span className="text-xs text-slate-400 font-mono">tabs.tsx</span>
                  </div>

                  <ShadcnTabs defaultValue="account" onValueChange={(val) => addAnnouncement(`shadcn Tab switched to: ${val}`)}>
                    <ShadcnTabsList className="w-full justify-start">
                      <ShadcnTabsTrigger value="account">Account</ShadcnTabsTrigger>
                      <ShadcnTabsTrigger value="password">Security</ShadcnTabsTrigger>
                      <ShadcnTabsTrigger value="settings">Preferences</ShadcnTabsTrigger>
                    </ShadcnTabsList>

                    <ShadcnTabsContent value="account">
                      <h4 className="text-sm font-semibold text-white mb-1">Radix Roving Focus Group</h4>
                      <p className="text-xs text-slate-400">
                        Supports RTL orientation detection, disabled item skipping, and automatic key listeners.
                      </p>
                    </ShadcnTabsContent>

                    <ShadcnTabsContent value="password">
                      <h4 className="text-sm font-semibold text-white mb-1">Security Settings</h4>
                      <p className="text-xs text-slate-400">
                        Tab panels inherit focus rings (`focus-visible:ring-2`) for seamless keyboard user experience.
                      </p>
                    </ShadcnTabsContent>

                    <ShadcnTabsContent value="settings">
                      <h4 className="text-sm font-semibold text-white mb-1">Preferences</h4>
                      <p className="text-xs text-slate-400">
                        Fully accessible compound sub-component API.
                      </p>
                    </ShadcnTabsContent>
                  </ShadcnTabs>
                </div>
              </div>
            </div>
          </CustomTabPanel>

          {/* TAB 3: DISCLOSURE & ACCORDION DEMO */}
          <CustomTabPanel value="disclosure">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Hand-Built Custom Disclosure & Accordion */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                      Hand-Built Custom Accordion
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Disclosure.tsx</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Custom Accessible Accordion</h3>
                  <p className="text-sm text-slate-400 mb-6">
                    Native button trigger with `aria-expanded` and `aria-controls`. Includes Arrow key navigation between accordion triggers.
                  </p>
                </div>

                <CustomAccordion
                  items={[
                    {
                      id: "item-1",
                      title: "What is W3C ARIA APG?",
                      content:
                        "The ARIA Authoring Practices Guide (APG) provides canonical design patterns for keyboard navigation, roles, states, and properties for web applications.",
                    },
                    {
                      id: "item-2",
                      title: "Why trap focus in a modal dialog?",
                      content:
                        "Without a focus trap, keyboard users tabbing through a open modal will cycle off the page into invisible background elements, causing extreme disorientation.",
                    },
                    {
                      id: "item-3",
                      title: "What is Roving tabIndex?",
                      content:
                        "Roving tabIndex sets tabIndex=0 on the active widget item and tabIndex=-1 on all siblings, keeping the tab stop clean while arrow keys move focus inside.",
                    },
                  ]}
                />
              </div>

              {/* shadcn/ui Accordion */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                      shadcn/ui Accordion
                    </span>
                    <span className="text-xs text-slate-400 font-mono">accordion.tsx</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">shadcn/ui Animated Accordion</h3>
                  <p className="text-sm text-slate-400 mb-6">
                    Built on `@radix-ui/react-accordion`. Supports animated collapse and expand transitions using CSS variables (`--radix-accordion-content-height`).
                  </p>
                </div>

                <ShadcnAccordion type="single" collapsible className="w-full">
                  <ShadcnAccordionItem value="item-1">
                    <ShadcnAccordionTrigger>How does Radix handle accordion height animation?</ShadcnAccordionTrigger>
                    <ShadcnAccordionContent>
                      Radix measures the scrollHeight of content panels and injects CSS custom properties so keyframe animations transition cleanly from 0 to content height.
                    </ShadcnAccordionContent>
                  </ShadcnAccordionItem>

                  <ShadcnAccordionItem value="item-2">
                    <ShadcnAccordionTrigger>What ARIA attributes are generated?</ShadcnAccordionTrigger>
                    <ShadcnAccordionContent>
                      It automatically links trigger buttons to panel IDs using `aria-controls` and sets `aria-expanded` and `role="region"`.
                    </ShadcnAccordionContent>
                  </ShadcnAccordionItem>
                </ShadcnAccordion>
              </div>
            </div>
          </CustomTabPanel>

          {/* TAB 4: NOTES.md PREVIEW REPORT */}
          <CustomTabPanel value="notes">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-400" /> NOTES.md Synthesis & Gap Analysis
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Detailed comparative findings between our custom hand-built components and shadcn/ui
                  </p>
                </div>
              </div>

              <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h4 className="font-semibold text-blue-400 mb-2">Gap 1: Multi-Layer Focus Scope Trap</h4>
                  <p className="text-xs text-slate-400">
                    Hand-crafted query selectors become stale on dynamic content. Radix uses `MutationObserver` and stacked focus scope managers to support nested dialogs cleanly.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h4 className="font-semibold text-purple-400 mb-2">Gap 2: Scrollbar Padding Layout Shift Lock</h4>
                  <p className="text-xs text-slate-400">
                    Toggling `overflow: hidden` causes background layout jumps on desktop browsers. Radix uses `react-remove-scroll` to calculate scrollbar width and inject padding offsets.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h4 className="font-semibold text-emerald-400 mb-2">Gap 3: Unmounting Exit Animation Presence</h4>
                  <p className="text-xs text-slate-400">
                    React unmounts elements instantly upon state change. Radix `@radix-ui/react-presence` tracks keyframe state and delays DOM removal until exit animations finish.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h4 className="font-semibold text-amber-400 mb-2">Gap 4: Screen Reader Fallback Announcements</h4>
                  <p className="text-xs text-slate-400">
                    Custom components rely on developers providing proper title IDs. Radix enforces structural `DialogTitle` subcomponents and emits dev console warnings if titles are missing.
                  </p>
                </div>
              </div>
            </div>
          </CustomTabPanel>
        </CustomTabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Flyrank AI Engineering • Track: Frontend AI Engineering (FE-05)</p>
          <p className="font-mono text-slate-400">Tested Keyboard-Only: Tab, Escape, Arrows, Enter, Space</p>
        </div>
      </footer>
    </div>
  );
}
