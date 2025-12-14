import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { useBookmarks } from "@/lib/use-bookmarks";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Maximize2,
  Minimize2,
  Plus,
  X,
  Bookmark,
  Share2,
  LogOut,
  Menu,
} from "lucide-react";

interface Tab {
  id: string;
  url: string;
  title: string;
  isLoading: boolean;
  history: string[];
  historyIndex: number;
}

export default function Proxy() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { bookmarks, addBookmark, removeBookmark } = useBookmarks();
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: "1",
      url: "",
      title: "New Tab",
      isLoading: false,
      history: [],
      historyIndex: -1,
    },
  ]);

  const [activeTabId, setActiveTabId] = useState("1");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const activeTab = tabs.find((t) => t.id === activeTabId)!;

  const addTab = () => {
    const newId = Date.now().toString();
    setTabs([
      ...tabs,
      {
        id: newId,
        url: "",
        title: "New Tab",
        isLoading: false,
        history: [],
        historyIndex: -1,
      },
    ]);
    setActiveTabId(newId);
  };

  const closeTab = (id: string) => {
    if (tabs.length === 1) return;
    const newTabs = tabs.filter((t) => t.id !== id);
    setTabs(newTabs);
    if (activeTabId === id) {
      setActiveTabId(newTabs[0].id);
    }
  };

  const updateTabUrl = (id: string, url: string) => {
    setTabs(
      tabs.map((t) =>
        t.id === id
          ? {
              ...t,
              url,
              history: [...t.history.slice(0, t.historyIndex + 1), url],
              historyIndex: t.history.length,
              title: new URL(url).hostname || url,
            }
          : t
      )
    );
  };

  const handleNavigate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.querySelector("input[type='text']") as HTMLInputElement;
    const value = input.value.trim();

    if (!value) return;

    let url = value;

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      if (url.includes(".") && !url.includes(" ")) {
        url = "https://" + url;
      } else {
        url = "https://www.google.com/search?q=" + encodeURIComponent(value);
      }
    }

    try {
      new URL(url);
      updateTabUrl(activeTabId, url);
      input.value = url;
    } catch {
      console.error("Invalid URL");
    }
  };

  const goBack = () => {
    const tab = tabs.find((t) => t.id === activeTabId);
    if (tab && tab.historyIndex > 0) {
      const newIndex = tab.historyIndex - 1;
      setTabs(
        tabs.map((t) =>
          t.id === activeTabId
            ? { ...t, historyIndex: newIndex, url: t.history[newIndex] }
            : t
        )
      );
    }
  };

  const goForward = () => {
    const tab = tabs.find((t) => t.id === activeTabId);
    if (tab && tab.historyIndex < tab.history.length - 1) {
      const newIndex = tab.historyIndex + 1;
      setTabs(
        tabs.map((t) =>
          t.id === activeTabId
            ? { ...t, historyIndex: newIndex, url: t.history[newIndex] }
            : t
        )
      );
    }
  };

  const toggleBookmark = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const alreadyBookmarked = bookmarks.some((b) => b.url === activeTab.url);

    if (alreadyBookmarked) {
      const bookmark = bookmarks.find((b) => b.url === activeTab.url);
      if (bookmark) {
        await removeBookmark(bookmark.id);
      }
    } else {
      await addBookmark(activeTab.url, activeTab.title);
    }
  };

  const reload = () => {
    if (iframeRef.current && activeTab.url) {
      iframeRef.current.src = `/api/proxy?url=${encodeURIComponent(activeTab.url)}`;
    }
  };

  const isCurrentUrlBookmarked = bookmarks.some((b) => b.url === activeTab.url);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div
      className={`flex h-screen bg-background transition-all ${
        isFullscreen ? "fixed inset-0 z-50" : ""
      }`}
    >
      {/* Bookmarks Sidebar */}
      {showBookmarks && !isFullscreen && (
        <div className="w-64 bg-card border-r border-border flex flex-col">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold">Bookmarks</h3>
            <button
              onClick={() => setShowBookmarks(false)}
              className="p-1 hover:bg-muted rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {bookmarks.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground text-sm">
                No bookmarks yet. Click the bookmark icon to save sites!
              </div>
            ) : (
              <div className="divide-y divide-border">
                {bookmarks.map((bookmark) => (
                  <a
                    key={bookmark.id}
                    href={bookmark.url}
                    onClick={(e) => {
                      e.preventDefault();
                      updateTabUrl(activeTabId, bookmark.url);
                      setShowBookmarks(false);
                    }}
                    className="block p-4 hover:bg-muted transition-colors group"
                  >
                    <p className="font-medium text-sm truncate group-hover:text-primary">
                      {bookmark.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {new URL(bookmark.url).hostname}
                    </p>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Header with Tabs */}
        <div className="bg-card border-b border-border">
          {/* Tabs Bar */}
          <div className="flex items-center gap-1 px-3 py-2 overflow-x-auto">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`group flex items-center gap-2 px-3 py-2 rounded-t-lg cursor-pointer transition-all whitespace-nowrap ${
                  activeTabId === tab.id
                    ? "bg-background border-b-2 border-primary"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground"
                }`}
                onClick={() => setActiveTabId(tab.id)}
              >
                <span className="text-sm font-medium max-w-xs truncate">
                  {tab.title || "New Tab"}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={addTab}
              className="ml-2 p-2 hover:bg-muted rounded-lg transition-colors"
              title="New Tab"
            >
              <Plus className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* URL Bar & Controls */}
          <div className="flex items-center gap-2 px-4 py-3 bg-card border-b border-border">
            {/* Navigation Buttons */}
            <Button
              variant="ghost"
              size="sm"
              onClick={goBack}
              disabled={activeTab.historyIndex <= 0}
              className="h-9 w-9 p-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={goForward}
              disabled={activeTab.historyIndex >= activeTab.history.length - 1}
              className="h-9 w-9 p-0"
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={reload}
              className="h-9 w-9 p-0"
            >
              <RotateCw className="w-4 h-4" />
            </Button>

            {/* URL Input */}
            <form onSubmit={handleNavigate} className="flex-1">
              <Input
                type="text"
                placeholder="Enter URL or search..."
                defaultValue={activeTab.url}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleNavigate(e as any);
                  }
                }}
                className="h-9 bg-muted border-0 focus:ring-primary"
              />
            </form>

            {/* Bookmarks Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBookmarks(!showBookmarks)}
              className="h-9 w-9 p-0"
              title="Bookmarks"
            >
              <Bookmark className="w-4 h-4" />
            </Button>

            {/* Bookmark Current Page Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleBookmark}
              className="h-9 w-9 p-0"
              title="Bookmark this page"
            >
              <Bookmark
                className="w-4 h-4"
                fill={isCurrentUrlBookmarked ? "currentColor" : "none"}
                stroke={isCurrentUrlBookmarked ? "hsl(280 100% 50%)" : "currentColor"}
              />
            </Button>

            {/* Share Button */}
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
              <Share2 className="w-4 h-4" />
            </Button>

            {/* Fullscreen Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="h-9 w-9 p-0"
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </Button>

            {/* Menu */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMenu(!showMenu)}
                className="h-9 w-9 p-0"
              >
                <Menu className="w-4 h-4" />
              </Button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
                  <div className="p-3 border-b border-border text-sm">
                    {user ? (
                      <p className="font-medium truncate">{user.email}</p>
                    ) : (
                      <p className="text-muted-foreground">Not signed in</p>
                    )}
                  </div>
                  <div className="p-2">
                    {user ? (
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-3 py-2 hover:bg-muted rounded text-sm flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    ) : (
                      <a
                        href="/auth"
                        className="block px-3 py-2 hover:bg-muted rounded text-sm"
                      >
                        Sign In
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden">
          {activeTab.url ? (
            <iframe
              ref={iframeRef}
              src={`/api/proxy?url=${encodeURIComponent(activeTab.url)}`}
              className="w-full h-full border-0"
              title={activeTab.title}
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-pointer-lock allow-modals allow-presentation allow-top-navigation allow-popups-to-escape-sandbox"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center flex-col gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Plus className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">New Tab</h2>
                <p className="text-muted-foreground">
                  Enter a URL or search term to get started
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="bg-card border-t border-border px-4 py-2 text-xs text-muted-foreground">
          {activeTab.isLoading ? (
            <span>Loading...</span>
          ) : activeTab.url ? (
            <span>Ready • {new URL(activeTab.url).hostname}</span>
          ) : (
            <span>Ready</span>
          )}
        </div>
      </div>
    </div>
  );
}
