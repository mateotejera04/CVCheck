import { useRef, useEffect, useState } from "react";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaListOl,
  FaListUl,
} from "react-icons/fa";

const RichTextInput = ({ value, onChange, placeholder = "Type here..." }) => {
  const ref = useRef();
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    if (ref.current && value !== ref.current.innerHTML) {
      ref.current.innerHTML = value || "";
    }
    setIsEmpty(!value || value === "<br>");
  }, [value]);

  const handleInput = () => {
    if (ref.current) {
      const html = ref.current.innerHTML;
      setIsEmpty(!html || html === "<br>");
      onChange(html);
    }
  };

  const format = (cmd) => {
    document.execCommand("defaultParagraphSeparator", false, "p");
    document.execCommand(cmd, false, null);
  };

  const tools = [
    { cmd: "bold", icon: FaBold, label: "Bold" },
    { cmd: "italic", icon: FaItalic, label: "Italic" },
    { cmd: "underline", icon: FaUnderline, label: "Underline" },
    { cmd: "insertOrderedList", icon: FaListOl, label: "Ordered list" },
    { cmd: "insertUnorderedList", icon: FaListUl, label: "Bullet list" },
  ];

  return (
    <div
      className="w-full rounded-xl overflow-hidden transition focus-within:ring-2"
      style={{
        border: "1px solid var(--border-hairline)",
        backgroundColor: "var(--surface-card)",
      }}
    >
      <div className="relative">
        {isEmpty && (
          <div className="absolute left-3 top-3 text-[color:var(--text-muted)] opacity-60 text-sm pointer-events-none select-none">
            {placeholder}
          </div>
        )}
        <div
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          spellCheck={false}
          onInput={handleInput}
          onPaste={(e) => {
            e.preventDefault();
            const text = e.clipboardData.getData("text/plain");
            document.execCommand(
              "insertHTML",
              false,
              text.replace(/\n/g, "<br>")
            );
          }}
          className="min-h-[180px] p-3 focus:outline-none text-sm text-[color:var(--text-primary)]"
          style={{ whiteSpace: "pre-wrap" }}
        />
      </div>

      <div
        className="flex gap-1 px-2 py-1.5"
        style={{
          borderTop: "1px solid var(--border-hairline)",
          backgroundColor: "var(--surface-base)",
        }}
      >
        {tools.map(({ cmd, icon: Icon, label }) => (
          <button
            key={cmd}
            type="button"
            onClick={() => format(cmd)}
            title={label}
            aria-label={label}
            className="p-2 rounded-md text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] hover:bg-[color:var(--accent-soft)] transition-colors"
          >
            <Icon className="text-sm" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default RichTextInput;
