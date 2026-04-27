// src/Components/Templates/ModernTemplate;.jsx
import React, { useEffect, useState } from "react";
import { useEditResume } from "../../Contexts/EditResumeContext";
import { BsBorderWidth, BsBoundingBoxCircles } from "react-icons/bs";
import { TbBorderCornerPill } from "react-icons/tb";
import { BiShowAlt } from "react-icons/bi";
import {
  FaExpand,
  FaEye,
  FaEyeSlash,
  FaFillDrip,
  FaFont,
  FaLink,
} from "react-icons/fa";
import { IoReorderThreeSharp } from "react-icons/io5";
import DOMPurify from "dompurify";
import { CgSpaceBetweenV } from "react-icons/cg";
import { motion } from "framer-motion";
import {
  FaDownload,
  FaFileAlt,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaMapMarkerAlt,
  FaLinkedinIn,
  FaGithub,
} from "react-icons/fa";
import {
  MdFormatAlignLeft,
  MdFormatAlignCenter,
  MdFormatAlignJustify,
  MdFormatAlignRight,
  MdOutlineTextDecrease,
  MdOutlineTextIncrease,
  MdOutlineColorize,
  MdFormatColorText,
} from "react-icons/md";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { useModernSetting } from "../../Contexts/CombinedTemplateContext";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { useLocale } from "../../Contexts/LocaleContext";

const ModernTemplate = ({ resume }) => {
  const { t } = useLocale();
  const { isEditable } = useEditResume();
  const { modernSettings, setModernSettings } = useModernSetting();
  const contentRef = useRef(null);
  const scaleWrapperRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  // A4 page is 794px wide. Scale it to fit the container width and adjust wrapper height.
  useEffect(() => {
    const wrapper = scaleWrapperRef.current;
    const page = contentRef.current;
    if (!wrapper || !page) return;

    const A4_WIDTH = 794;
    const A4_HEIGHT = 1123;

    const updateScale = () => {
      const containerWidth = wrapper.clientWidth;
      const scale = Math.min(1, containerWidth / A4_WIDTH);
      page.style.setProperty("--a4-scale", scale);
      // Match wrapper height to scaled page height (page might grow if multi-page content)
      const pageHeight = Math.max(page.scrollHeight, A4_HEIGHT);
      wrapper.style.height = `${pageHeight * scale}px`;
    };

    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(wrapper);
    ro.observe(page);
    return () => ro.disconnect();
  }, [resume, modernSettings]);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // start drag after small pointer move
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100, // long press for smoother intent
        tolerance: 10, // slight finger movement allowed
      },
    })
  );

  const [openDropdown, setOpenDropdown] = useState(null); // values: "toggle", "font", "reorder", etc.

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside any dropdown container
      const dropdownContainers = document.querySelectorAll(
        ".dropdown-container"
      );
      let isClickOutside = true;

      dropdownContainers.forEach((container) => {
        if (container.contains(event.target)) {
          isClickOutside = false;
        }
      });

      if (isClickOutside && openDropdown) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [openDropdown]);

  if (!resume) return null;

  const pixelSizes = [
    4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 30, 36, 48, 60, 72, 96, 128,
  ];

  const getCustomFontClass = (basePx, level = 0) => {
    const base = parseInt(basePx.replace(/\D/g, ""), 10);
    const index = pixelSizes.indexOf(base);
    if (index === -1) return `text-[${base}px]`; // fallback
    const newIndex = Math.max(
      0,
      Math.min(pixelSizes.length - 1, index + level)
    );
    return `text-[${pixelSizes[newIndex]}px]`;
  };

  const getFontPxValue = (basePx, level = 0) => {
    const base = parseInt(basePx.replace(/\D/g, ""), 10);
    const index = pixelSizes.indexOf(base);
    if (index === -1) return base; // fallback
    const newIndex = Math.max(
      0,
      Math.min(pixelSizes.length - 1, index + level)
    );
    return pixelSizes[newIndex];
  };

  const defaultTextColor = (tag) => {
    switch (tag) {
      case "h1":
        return "#1e3a5f";
      case "h2":
        return "#0f172a";
      case "h3":
        return "#1f2937";
      case "h4":
        return "#475569";
      default:
        return "#0f172a";
    }
  };

  const alignClass = (() => {
    switch (modernSettings.descriptionAlign) {
      case "center":
        return "justify-center";
      case "right":
        return "justify-end";
      case "justify":
        return "justify-between";
      default:
        return "justify-start";
    }
  })();

  const SortableItem = ({ id }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id });

    const style = {
      transform: CSS.Transform.toString({
        ...transform,
        scaleX: isDragging ? 1.03 : 1,
        scaleY: isDragging ? 1.03 : 1,
      }),

      transition: transition ?? "transform 200ms ease",
      opacity: isDragging ? 0.6 : 1,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="flex items-center overflow-y-hidden justify-between px-2 py-1 md:py-2 bg-gray-50 border border-gray-200 rounded-md text-[12px] md:text-xs cursor-grab touch-none hover:bg-gray-100 transition"
        title={id}
      >
        <span className="capitalize text-gray-700 truncate max-w-[80%]">
          {id.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
        </span>
        <IoReorderThreeSharp className="text-gray-500 flex-shrink-0" />
      </div>
    );
  };

  useEffect(() => {
    if (!modernSettings.visibleSections) {
      setModernSettings((prev) => ({
        ...prev,
        visibleSections: {
          name: true,
          details: true,
          description: false,
          education: true,
          skills: true,
          projects: true,
          experience: true,
          achievements: true,
        },
      }));
    }
  }, []);

  useEffect(() => {
    if (!modernSettings.sectionOrder) {
      setModernSettings((prev) => ({
        ...prev,
        sectionOrder: [
          "name",
          "details",
          "experience",
          "education",
          "skills",
          "projects",
          "achievements",
        ],
      }));
    }
  }, []);

  const hasAnyProjectLink =
    resume.contact?.email ||
    resume.contact?.linkedin ||
    resume.contact?.github ||
    resume.projects?.some((proj) => proj.demo || proj.github);

  const accentColor = modernSettings.TextColors?.["h1"] || "#1e3a5f";
  const inkColor = modernSettings.TextColors?.["h2"] || "#0f172a";
  const inkSoftColor = modernSettings.TextColors?.["h3"] || "#1f2937";
  const mutedColor = modernSettings.TextColors?.["h4"] || "#475569";
  const ruleColor = modernSettings.borderColor || "#1f2937";

  const SectionTitle = ({ children }) => (
    <h2
      className="resume-h3 resume-eyebrow w-1/4 pt-1"
      style={{
        color: inkColor,
        fontFamily: "var(--resume-display-modern)",
        "--resume-h3-user": `${getFontPxValue("12", modernSettings.fontScaleLevel)}px`,
      }}
    >
      {children}
    </h2>
  );

  const SectionRow = ({ title, children }) => (
    <div
      className="flex gap-6 pt-4 border-t"
      style={{ borderColor: ruleColor, opacity: 1 }}
    >
      <SectionTitle>{title}</SectionTitle>
      <div className="w-3/4 min-w-0">{children}</div>
    </div>
  );

  const sectionMap = {
    name: (
      <div className="flex items-start gap-7 pb-5">
        {resume.imgUrl && (
          <img
            src={resume.imgUrl}
            alt={resume.name}
            className="w-32 h-32 md:w-36 md:h-36 rounded-full object-cover flex-shrink-0"
            style={{
              border: "3px solid #ffffff",
              boxShadow: "0 0 0 1px rgba(15, 23, 42, 0.08)",
            }}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        )}
        <div className="flex-1 min-w-0">
          <h1
            className={`resume-h1 ${getCustomFontClass(
              "text-[48px]",
              modernSettings.fontScaleLevel
            )} leading-[1.05] tracking-[-0.01em]`}
            style={{
              color: accentColor,
              fontFamily: "var(--resume-display-modern)",
              fontWeight: 600,
              textAlign: modernSettings.descriptionAlign || "left",
              "--resume-h1-user": `${getFontPxValue(
                "48",
                modernSettings.fontScaleLevel
              )}px`,
            }}
          >
            {resume.name}
          </h1>
          {resume.headline && (
            <p
              className="resume-eyebrow mt-2"
              style={{
                color: inkColor,
                textAlign: modernSettings.descriptionAlign || "left",
              }}
            >
              {resume.headline}
            </p>
          )}
          {resume.description && (
            <div
              className={`resume-h4 resume-content mt-3 ${getCustomFontClass(
                "text-[12px]",
                modernSettings.fontScaleLevel
              )}`}
              style={{
                color: inkSoftColor,
                textAlign: modernSettings.descriptionAlign || "justify",
                "--resume-h4-user": `${getFontPxValue(
                  "12",
                  modernSettings.fontScaleLevel
                )}px`,
              }}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(resume.description),
              }}
            />
          )}
        </div>
      </div>
    ),

    details: (
      <div
        className="flex flex-wrap items-center gap-x-6 gap-y-3 py-4 border-t"
        style={{ borderColor: ruleColor }}
      >
        {[
          resume.contact.phone && {
            icon: <FaPhone size={9} />,
            value: resume.contact.phone,
            href: `tel:${resume.contact.phone}`,
          },
          resume.contact.email && {
            icon: <FaEnvelope size={9} />,
            value: resume.contact.email,
            href: `mailto:${resume.contact.email}`,
          },
          resume.contact.location && {
            icon: <FaMapMarkerAlt size={9} />,
            value: resume.contact.location,
            href: null,
          },
          resume.contact.websiteURL && {
            icon: <FaGlobe size={9} />,
            value: resume.contact.websiteURL.replace(/^https?:\/\//, "").replace(/^www\./, ""),
            href: resume.contact.websiteURL,
          },
          resume.contact.linkedin && {
            icon: <FaLinkedinIn size={9} />,
            value: resume.contact.linkedin
              .replace(/^https?:\/\//, "")
              .replace(/^www\./, "")
              .replace(/^linkedin\.com\/in\//, ""),
            href: resume.contact.linkedin,
          },
          resume.contact.github && {
            icon: <FaGithub size={9} />,
            value: resume.contact.github
              .replace(/^https?:\/\//, "")
              .replace(/^www\./, "")
              .replace(/^github\.com\//, ""),
            href: resume.contact.github,
          },
        ]
          .filter(Boolean)
          .map((item, i) => (
            <div key={i} className="flex items-center gap-2 min-w-0">
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-white"
                style={{ backgroundColor: inkSoftColor }}
              >
                {item.icon}
              </span>
              {item.href ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`resume-h4 ${getCustomFontClass(
                    "text-[11px]",
                    modernSettings.fontScaleLevel
                  )} truncate`}
                  style={{
                    color: modernSettings.linkColor || inkColor,
                    "--resume-h4-user": `${getFontPxValue(
                      "11",
                      modernSettings.fontScaleLevel
                    )}px`,
                  }}
                >
                  {item.value}
                </a>
              ) : (
                <span
                  className={`resume-h4 ${getCustomFontClass(
                    "text-[11px]",
                    modernSettings.fontScaleLevel
                  )} truncate`}
                  style={{
                    color: inkColor,
                    "--resume-h4-user": `${getFontPxValue(
                      "11",
                      modernSettings.fontScaleLevel
                    )}px`,
                  }}
                >
                  {item.value}
                </span>
              )}
            </div>
          ))}
      </div>
    ),

    description: (
      <SectionRow title="SUMMARY">
        <div
          className={`resume-h4 resume-content ${getCustomFontClass(
            "text-[12px]",
            modernSettings.fontScaleLevel
          )}`}
          style={{
            color: inkSoftColor,
            textAlign: modernSettings.descriptionAlign || "justify",
            "--resume-h4-user": `${getFontPxValue(
              "12",
              modernSettings.fontScaleLevel
            )}px`,
          }}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(resume.description),
          }}
        />
      </SectionRow>
    ),

    education: (
      <SectionRow title="EDUCATION">
        <div
          className={`resume-h4 ${getCustomFontClass(
            "text-[12px]",
            modernSettings.fontScaleLevel
          )}`}
          style={{
            "--resume-h4-user": `${getFontPxValue(
              "12",
              modernSettings.fontScaleLevel
            )}px`,
          }}
        >
          <div className="flex justify-between items-baseline gap-4 flex-wrap">
            <p
              className="font-semibold uppercase tracking-wide"
              style={{ color: inkColor }}
            >
              {resume.education.college}
            </p>
            <p
              className="italic resume-tnum"
              style={{ color: mutedColor }}
            >
              {resume.education.startYear}
              {resume.education.startYear && resume.education.endYear && " – "}
              {resume.education.endYear}
            </p>
          </div>
          <div
            className="flex justify-between items-baseline gap-4 flex-wrap mt-0.5"
            style={{ color: inkSoftColor }}
          >
            <p className="italic">
              {resume.education.degree}
              {resume.education.specialization &&
                ` (${resume.education.specialization})`}
            </p>
            {resume.education.location && (
              <p className="italic">{resume.education.location}</p>
            )}
          </div>
          {resume.education.cgpa && (
            <p className="resume-tnum mt-0.5" style={{ color: mutedColor }}>
              {resume.education.cgpa} CGPA
            </p>
          )}
        </div>
      </SectionRow>
    ),

    skills: (
      <SectionRow title="SKILLS">
        <ul
          className={`resume-h4 space-y-1 ${getCustomFontClass(
            "text-[12px]",
            modernSettings.fontScaleLevel
          )}`}
          style={{
            "--resume-h4-user": `${getFontPxValue(
              "12",
              modernSettings.fontScaleLevel
            )}px`,
          }}
        >
          {resume.skills.map((skill, i) => (
            <li key={i}>
              <span
                className="font-semibold mr-2"
                style={{ color: inkColor }}
              >
                {skill.domain}:
              </span>
              <span style={{ color: inkSoftColor }}>
                {skill.languages.join(", ")}
              </span>
            </li>
          ))}
        </ul>
      </SectionRow>
    ),

    experience: (
      <SectionRow title="EXPERIENCE">
        <ul
          className={`resume-h4 space-y-3 ${getCustomFontClass(
            "text-[12px]",
            modernSettings.fontScaleLevel
          )}`}
          style={{
            "--resume-h4-user": `${getFontPxValue(
              "12",
              modernSettings.fontScaleLevel
            )}px`,
          }}
        >
          {resume.experience.map((a, i) => (
            <li key={i}>
              <div
                className="flex justify-between items-baseline gap-4 flex-wrap"
                style={{ color: inkColor }}
              >
                <p className="font-semibold uppercase tracking-wide">
                  {a.company}
                  {a.role && (
                    <span
                      className="font-normal italic normal-case ml-2"
                      style={{ color: inkSoftColor, letterSpacing: 0 }}
                    >
                      {a.role}
                    </span>
                  )}
                </p>
                <p
                  className="italic resume-tnum"
                  style={{ color: mutedColor }}
                >
                  {a.years}
                </p>
              </div>
              {a.technologies && a.technologies.trim() !== "" && (
                <p className="mt-0.5" style={{ color: mutedColor }}>
                  <span className="font-bold">
                    {t("templateControls.technologies")}
                  </span>{" "}
                  {a.technologies}
                </p>
              )}
              <div
                className="resume-content mt-1"
                style={{
                  color: inkSoftColor,
                  textAlign: modernSettings.descriptionAlign || "left",
                }}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(a.description),
                }}
              />
            </li>
          ))}
        </ul>
      </SectionRow>
    ),

    projects: (
      <SectionRow title="PROJECTS">
        <ul
          className={`resume-h4 space-y-3 ${getCustomFontClass(
            "text-[12px]",
            modernSettings.fontScaleLevel
          )}`}
          style={{
            "--resume-h4-user": `${getFontPxValue(
              "12",
              modernSettings.fontScaleLevel
            )}px`,
          }}
        >
          {resume.projects.map((proj, i) => (
            <li key={i}>
              <div className="flex justify-between items-baseline gap-4 flex-wrap">
                <p
                  className="font-semibold uppercase tracking-wide"
                  style={{ color: inkColor }}
                >
                  {proj.name}
                </p>
                {(proj.demo || proj.github) && (
                  <span
                    className="italic resume-tnum"
                    style={{ color: mutedColor }}
                  >
                    {proj.demo && (
                      <a
                        href={proj.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                        style={{
                          color: modernSettings.linkColor || accentColor,
                        }}
                      >
                        Live Demo
                      </a>
                    )}
                    {proj.demo && proj.github && (
                      <span className="mx-1.5">·</span>
                    )}
                    {proj.github && (
                      <a
                        href={proj.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                        style={{
                          color: modernSettings.linkColor || accentColor,
                        }}
                      >
                        GitHub
                      </a>
                    )}
                  </span>
                )}
              </div>
              <div
                className="resume-content mt-1"
                style={{
                  color: inkSoftColor,
                  textAlign: modernSettings.descriptionAlign || "left",
                }}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(proj.description),
                }}
              />
            </li>
          ))}
        </ul>
      </SectionRow>
    ),

    achievements: (
      <SectionRow title="ACHIEVEMENTS">
        <ul
          className={`resume-h4 space-y-3 ${getCustomFontClass(
            "text-[12px]",
            modernSettings.fontScaleLevel
          )}`}
          style={{
            "--resume-h4-user": `${getFontPxValue(
              "12",
              modernSettings.fontScaleLevel
            )}px`,
          }}
        >
          {resume.achievements.map((a, i) => (
            <li key={i}>
              <div className="flex justify-between items-baseline gap-4 flex-wrap">
                <p
                  className="font-semibold uppercase tracking-wide"
                  style={{ color: inkColor }}
                >
                  {a.title}
                </p>
                {(a.month || a.year) && (
                  <p
                    className="italic resume-tnum"
                    style={{ color: mutedColor }}
                  >
                    {a.month || ""} {a.year || ""}
                  </p>
                )}
              </div>
              <div
                className="resume-content mt-1"
                style={{
                  color: inkSoftColor,
                  textAlign: modernSettings.descriptionAlign || "left",
                }}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(a.description),
                }}
              />
            </li>
          ))}
        </ul>
      </SectionRow>
    ),
  };

  return (
    <div className="">
      {/* Preview Header - more compact */}
      <div className="bg-gradient-to-r from-slate-100/80 to-sky-50/80 p-4 border-b border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white/80 rounded-lg shadow-sm">
              <FaFileAlt className="text-sky-600 text-xs" />
            </div>
            <div>
              <h3 className="text-[14px] md:text-sm font-semibold text-slate-900">
                {t("templateControls.resumePreview")}
              </h3>
              <p className="text-[10px] md:text-xs text-slate-600">
                {resume.name} {t("templateControls.professionalResume")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <motion.button
              onClick={reactToPrintFn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-1.5 bg-white/80 flex hover:bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-slate-600 hover:text-sky-600"
              title={t("templateControls.downloadPdf")}
            >
              <FaDownload size={12} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      {isEditable && (
        <div className="w-full bg-white justify-center border border-gray-200  px-2.5 md:px-6 py-2.5 md:py-3 mb-2.5 md:mb-6 flex flex-wrap items-center gap-3">
          {/* Resume Background Color */}
          <div className="relative dropdown-container">
            {/* Color Icon Button */}
            <button
              className={`md:p-2 rounded-md hover:bg-gray-200 transition relative group ${
                openDropdown === "bgColor" ? "bg-gray-200" : ""
              }`}
              title={t("templateControls.backgroundColor")}
              onClick={() =>
                setOpenDropdown((prev) =>
                  prev === "bgColor" ? null : "bgColor"
                )
              }
            >
              <FaFillDrip className="text-sm md:text-xl text-gray-700" />
              <span
                className="hidden md:block absolute w-4 h-4 rounded-full border border-gray-300 right-1 top-1"
                style={{
                  backgroundColor:
                    modernSettings.backgroundColor || "#ffffff",
                }}
              ></span>
            </button>

            {/* Color Picker Panel */}
            {openDropdown === "bgColor" && (
              <div className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-fit left-0">
                <p className="text-xs md:text-sm font-semibold text-gray-700 mb-3">
                  Background Color
                </p>

                <div className="flex items-center gap-2 md:gap-4">
                  {/* Fixed Swatches (Left) */}
                  <div className="flex gap-1 md:gap-2">
                    {[
                      "#ffffff",
                      "#f1f5f9",
                      "#fef3c7",
                      "#e0f2fe",
                      "#fce7f3",
                    ].map((clr) => (
                      <button
                        key={clr}
                        className={`h-4 w-4 md:w-6 md:h-6 rounded-full border transition-all hover:scale-105 ${
                          clr === modernSettings.backgroundColor
                            ? "ring-2 ring-offset-1 ring-sky-500"
                            : ""
                        }`}
                        style={{ backgroundColor: clr }}
                        onClick={() =>
                          setModernSettings((prev) => ({
                            ...prev,
                            backgroundColor: clr,
                          }))
                        }
                        title={clr}
                      />
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="w-px h-6 bg-gray-300" />

                  {/* Custom Color Picker (Right) */}
                  <div className="relative h-4 w-4 md:w-6 md:h-6 rounded-full overflow-hidden border cursor-pointer group">
                    <div
                      className="absolute inset-0 z-0 flex items-center justify-center rounded-full"
                      style={{
                        backgroundColor:
                          modernSettings.backgroundColor || "#ffffff",
                      }}
                    >
                      <FaFillDrip className="text-gray-600/50 text-[10px] md:text-sm drop-shadow group-hover:scale-110 transition" />
                    </div>

                    <input
                      type="color"
                      value={modernSettings.backgroundColor || "#ffffff"}
                      onChange={(e) =>
                        setModernSettings((prev) => ({
                          ...prev,
                          backgroundColor: e.target.value,
                        }))
                      }
                      className="absolute inset-0 z-10 opacity-0 cursor-pointer"
                      title={t("templateControls.pickCustomColor")}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Description Alignment */}
          <div className="flex items-center gap-1 md:gap-3">
            <div className="flex gap-1 md:gap-2 bg-gray-100 p-1 rounded-md">
              {[
                {
                  icon: <MdFormatAlignLeft />,
                  value: "left",
                  title: "Align left",
                },
                {
                  icon: <MdFormatAlignCenter />,
                  value: "center",
                  title: "Align center",
                },
                {
                  icon: <MdFormatAlignRight />,
                  value: "right",
                  title: "Align right",
                },
                {
                  icon: <MdFormatAlignJustify />,
                  value: "justify",
                  title: "Align justify",
                },
              ].map(({ icon, value }) => (
                <button
                  key={value}
                  onClick={() =>
                    setModernSettings((prev) => ({
                      ...prev,
                      descriptionAlign: value,
                    }))
                  }
                  className={`p-1 md:p-2 text-sm md:text-lg md:rounded-md transition ${
                    modernSettings.descriptionAlign === value
                      ? "bg-white shadow  "
                      : "hover:bg-white/80"
                  }`}
                  title={`Align ${value}`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Font Selector */}
          <div className="relative dropdown-container">
            {/* Trigger Button */}
            <button
              onClick={() =>
                setOpenDropdown((prev) => (prev === "font" ? null : "font"))
              }
              title={t("templateControls.changeFont")}
              className={`md:p-2 rounded-md hover:bg-gray-100 transition ${
                openDropdown === "font" ? "bg-gray-100" : ""
              }`}
            >
              <FaFont className="text-gray-700 text-xs md:text-lg" />
            </button>

            {/* Dropdown Menu */}
            {openDropdown === "font" && (
              <div className="absolute z-50 mt-2 bg-white border border-gray-200 shadow-lg rounded-lg p-3 w-40 md:w-52 right-0">
                <p className="text-xs md:text-sm font-semibold text-gray-700 mb-2">
                  Select Font
                </p>

                <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
                  {[
                    "Playfair Display",
                    "Cormorant Garamond",
                    "DM Sans",
                    "Lora",
                    "Source Sans 3",
                    "Manrope",
                    "Bricolage Grotesque",
                    "Inter",
                    "Roboto",
                    "Poppins",
                    "Lato",
                    "Merriweather",
                    "Open Sans",
                    "Nunito",
                    "Montserrat",
                    "Work Sans",
                    "Ubuntu",
                    "Fira Sans",
                    "Source Sans Pro",
                    "Raleway",
                    "Mulish",
                    "PT Sans",
                    "Helvetica",
                    "Segoe UI",
                    "Georgia",
                    "Times New Roman",
                    "Courier New",
                    "Lucida Console",
                    "Arial",
                  ].map((font) => (
                    <button
                      key={font}
                      onClick={() => {
                        setModernSettings((prev) => ({
                          ...prev,
                          fontFamily: font,
                        }));
                        setOpenDropdown(false);
                      }}
                      className={`text-xs md:text-sm text-left px-2 md:px-3 py-1 rounded hover:bg-gray-100 transition ${
                        modernSettings.fontFamily === font
                          ? "bg-sky-50 text-sky-700 font-medium"
                          : "text-gray-700"
                      }`}
                      style={{ fontFamily: font }}
                    >
                      {font}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Font Size Adjustments */}
          <div className="flex items-center gap-3">
            <button
              title={t("templateControls.decreaseFontSize")}
              onClick={() =>
                setModernSettings((prev) => ({
                  ...prev,
                  fontScaleLevel: Math.max(-10, (prev.fontScaleLevel || 0) - 1),
                }))
              }
              className="md:p-2 align-middle  rounded hover:bg-gray-200"
            >
              <span className="text-lg align-middle md:text-xl">
                <MdOutlineTextDecrease />
              </span>
            </button>

            <button
              title={t("templateControls.increaseFontSize")}
              onClick={() =>
                setModernSettings((prev) => ({
                  ...prev,
                  fontScaleLevel: Math.min(10, (prev.fontScaleLevel || 0) + 1),
                }))
              }
              className="md:p-2 align-middle rounded hover:bg-gray-200"
            >
              <span className="text-lg align-middle md:text-xl">
                <MdOutlineTextIncrease />
              </span>
            </button>
          </div>

          {/* Section Spacing */}
          <div className="relative dropdown-container">
            <button
              onClick={() =>
                setOpenDropdown((prev) => (prev === "gap" ? null : "gap"))
              }
              className={`md:p-2   text-center align-middle rounded-md hover:bg-gray-100 transition ${
                openDropdown === "gap" ? "bg-gray-100" : ""
              }`}
              title={t("templateControls.adjustSectionSpacing")}
            >
              <CgSpaceBetweenV className="text-lg md:text-xl text-gray-700" />
            </button>

            {openDropdown === "gap" && (
              <div className="absolute max-h-48 overflow-auto left-1/2 -translate-x-1/2 mt-2 z-50 w-24 md:w-56 bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                <h3 className="text-[14px] md:text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <CgSpaceBetweenV className="text-sky-700" />
                  Section Spacing
                </h3>

                <ul className="space-y-1 text-[14px] md:text-sm text-gray-600">
                  {[
                    { label: "None", value: "py-0" },
                    { label: "Extra Small", value: "py-1" },
                    { label: "Small", value: "py-2" },
                    { label: "Medium", value: "py-3" },
                    { label: "Large", value: "py-4" },
                    { label: "Extra Large", value: "py-5" },
                    { label: "Huge", value: "py-6" },
                    { label: "Massive", value: "py-7" },
                    { label: "Giant", value: "py-8" },
                    { label: "Colossal", value: "py-10" },
                    { label: "Titanic", value: "py-12" },
                    { label: "Epic", value: "py-14" },
                  ].map((option) => (
                    <li
                      key={option.value}
                      onClick={() => {
                        setModernSettings((prev) => ({
                          ...prev,
                          sectionPaddingY: option.value,
                        }));
                        setOpenDropdown(null); // Close dropdown after selection
                      }}
                      className={`px-1 md:px-3 py-1.5 rounded cursor-pointer hover:bg-sky-50 transition ${
                        modernSettings.sectionPaddingY === option.value
                          ? "bg-sky-100 text-sky-700 "
                          : ""
                      }`}
                    >
                      {option.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Padding Dropdown */}
          <div className="relative dropdown-container">
            <button
              onClick={() =>
                setOpenDropdown((prev) =>
                  prev === "padding" ? null : "padding"
                )
              }
              title={t("templateControls.margin")}
              className={`md:p-2 rounded-md text-center align-middle hover:bg-gray-100 transition ${
                openDropdown === "padding" ? "bg-gray-100" : ""
              }`}
            >
              {/* Any padding or spacing icon, e.g., FaExpandArrowsAlt */}
              <FaExpand className="text-gray-700 text-sm md:text-lg" />
            </button>

            {openDropdown === "padding" && (
              <div className="absolute max-h-48 md:max-h-64 overflow-auto left-1/2 -translate-x-1/2 mt-2 z-50 w-56 bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                <p className="text-xs md:text-sm font-semibold text-gray-700 mb-1.5 md:mb-3 md:text-center">
                  Select Padding
                </p>

                <ul className="flex flex-col gap-1 max-h-60 pr-1">
                  {[
                    { label: "None", value: "0px" },
                    { label: "Extra Small", value: "2px" },
                    { label: "Small", value: "4px" },
                    { label: "Normal", value: "8px" },
                    { label: "Medium", value: "12px" },
                    { label: "Large", value: "16px" },
                    { label: "Extra Large", value: "20px" },
                    { label: "Huge", value: "24px" },
                    { label: "Massive", value: "28px" },
                    { label: "Giant", value: "32px" },
                    { label: "Colossal", value: "36px" },
                    { label: "Titanic", value: "40px" },
                    { label: "Epic", value: "44px" },
                  ].map((p) => (
                    <li key={p.value}>
                      <button
                        onClick={() => {
                          setModernSettings((prev) => ({
                            ...prev,
                            padding: p.value,
                          }));
                          setOpenDropdown(false);
                        }}
                        className={`px-1.5 text-[12px] md:text-base md:px-3 py-1.5 text-left w-full rounded cursor-pointer hover:bg-sky-50 transition ${
                          modernSettings.padding === p.value
                            ? "bg-sky-100 text-sky-700 font-semibold"
                            : ""
                        }`}
                      >
                        {p.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Top Border Width Dropdown */}
          <div className="relative dropdown-container">
            <button
              onClick={() =>
                setOpenDropdown((prev) =>
                  prev === "borderTopWidth" ? null : "borderTopWidth"
                )
              }
              title={t("templateControls.sectionsBorderWidth")}
              className={`md:p-2 rounded-md text-center align-middle hover:bg-gray-100 transition ${
                openDropdown === "borderTopWidth" ? "bg-gray-100" : ""
              }`}
            >
              <BsBorderWidth className="text-gray-700 text-sm md:text-lg" />
            </button>

            {openDropdown === "borderTopWidth" && (
              <div className="absolute z-50 mt-2 left-1/2 -translate-x-1/2 bg-white border border-gray-200 shadow-xl rounded-lg p-1.5 md:p-3 w-32 md:max-w-[90vw]">
                <p className="text-xs md:text-sm font-semibold text-gray-700 mb-1.5 md:mb-3 text-center">
                  Top Border
                </p>

                <ul className="flex flex-col gap-1 max-h-60 overflow-y-auto pr-1">
                  {[
                    { label: "None", value: "0px" },
                    { label: "1px", value: "1px" },
                    { label: "2px", value: "2px" },
                    { label: "4px", value: "4px" },
                    { label: "6px", value: "6px" },
                    { label: "8px", value: "8px" },
                  ].map((w) => (
                    <li key={w.value}>
                      <button
                        onClick={() => {
                          setModernSettings((prev) => ({
                            ...prev,
                            borderTopWidth: w.value,
                          }));
                          setOpenDropdown(false);
                        }}
                        className={`w-full justify-center h-5 px-1 py-1.5 rounded-xs flex items-center gap-5 hover:bg-sky-50 transition ${
                          modernSettings.borderTopWidth === w.value
                            ? "bg-sky-100"
                            : "text-gray-800"
                        }`}
                      >
                        {w.value === "0px" ? (
                          <span className="text-xs md:text-sm text-center text-gray-500">
                            No Border
                          </span>
                        ) : (
                          <div
                            style={{
                              borderTop: `${w.value} solid #334155`,
                              width: "100%",
                            }}
                          ></div>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/*border style and color*/}
          <div className="relative dropdown-container">
            <button
              onClick={() =>
                setOpenDropdown((prev) =>
                  prev === "borderStyles" ? null : "borderStyles"
                )
              }
              title={t("templateControls.sectionBorderStyleColor")}
              className={`md:p-2 text-center align-middle rounded-md hover:bg-gray-100 transition ${
                openDropdown === "borderStyles" ? "bg-gray-100" : ""
              }`}
            >
              <BsBoundingBoxCircles className="text-gray-700 text-sm md:text-lg" />
            </button>

            {openDropdown === "borderStyles" && (
              <div className="absolute z-50 mt-2 bg-white border border-gray-200 shadow-lg rounded-lg p-3 w-40 left-0">
                <p className="text-xs md:text-sm font-semibold text-gray-700 mb-2">
                  Border Settings
                </p>

                {/* Border Style */}
                <div className="mb-2 md:mb-4">
                  <label className="block text-xs text-gray-500 mb-1">
                    Style
                  </label>
                  <select
                    value={modernSettings.borderStyle || "solid"}
                    onChange={(e) =>
                      setModernSettings((prev) => ({
                        ...prev,
                        borderStyle: e.target.value,
                      }))
                    }
                    className="w-full border text-xs md:text-sm rounded px-2 py-1 focus:outline-none"
                  >
                    <option value="solid">{t("templateControls.borderStyles.solid")}</option>
                    <option value="dotted">{t("templateControls.borderStyles.dotted")}</option>
                    <option value="dashed">{t("templateControls.borderStyles.dashed")}</option>
                    <option value="double">{t("templateControls.borderStyles.double")}</option>
                    <option value="groove">{t("templateControls.borderStyles.groove")}</option>
                    <option value="ridge">{t("templateControls.borderStyles.ridge")}</option>
                    <option value="inset">{t("templateControls.borderStyles.inset")}</option>
                    <option value="outset">{t("templateControls.borderStyles.outset")}</option>
                  </select>
                </div>

                {/* Border Color */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Color
                  </label>
                  <input
                    type="color"
                    value={modernSettings.borderColor || "#cbd5e1"}
                    onChange={(e) =>
                      setModernSettings((prev) => ({
                        ...prev,
                        borderColor: e.target.value,
                      }))
                    }
                    className="w-full h-8 rounded border cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Text Color Button */}
          <div className="relative group dropdown-container">
            <button
              className={`md:p-2 align-middle text-center rounded-md hover:bg-gray-100 transition ${
                openDropdown === "TextColor" ? "bg-gray-100" : ""
              }`}
              title={t("templateControls.textColor")}
              onClick={() =>
                setOpenDropdown((prev) =>
                  prev === "TextColor" ? null : "TextColor"
                )
              }
            >
              <MdFormatColorText className="text-sm md:text-lg text-gray-700" />
            </button>

            {openDropdown === "TextColor" && (
              <div className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-fit right-0">
                {["h1", "h2", "h3", "h4"].map((tag) => (
                  <div key={tag} className="flex items-center gap-3 mb-2">
                    <span className="uppercase text-xs w-5">{tag}</span>

                    <div className="relative w-5 h-5 rounded-full overflow-hidden border cursor-pointer group">
                      <div
                        className="absolute inset-0 z-0 rounded-full"
                        style={{
                          backgroundColor:
                            modernSettings.TextColors?.[tag] ||
                            defaultTextColor(tag),
                        }}
                      />
                      <input
                        type="color"
                        value={
                          modernSettings.TextColors?.[tag] ||
                          defaultTextColor(tag)
                        }
                        onChange={(e) =>
                          setModernSettings((prev) => ({
                            ...prev,
                            TextColors: {
                              ...prev.TextColors,
                              [tag]: e.target.value,
                            },
                          }))
                        }
                        className="absolute inset-0 z-10 opacity-0 cursor-pointer"
                        title={`Change ${tag.toUpperCase()} color`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Link Color Button */}
          {hasAnyProjectLink && (
            <div className="relative dropdown-container">
              {/* Trigger Button */}
              <button
                onClick={() =>
                  setOpenDropdown((prev) =>
                    prev === "linkColor" ? null : "linkColor"
                  )
                }
                className={`md:p-2 align-middle rounded-md hover:bg-gray-100 transition ${
                  openDropdown === "linkColor" ? "bg-gray-100" : ""
                }`}
                title={t("templateControls.changeProjectLinkColor")}
              >
                <FaLink className="text-sm md:text-lg text-gray-700" />
              </button>

              {/* Picker Panel */}
              {openDropdown === "linkColor" && (
                <div className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-2.5 md:p-4 w-fit right-0">
                  <p className="text-xs md:text-sm font-semibold text-gray-700 mb-3">
                    Project Link Color
                  </p>

                  <div className="flex items-center gap-2.5 md:gap-4">
                    {/* Preset Swatches */}
                    <div className="flex gap-1 md:gap-2">
                      {[
                        "#2563eb", // sky
                        "#7c3aed", // blue
                        "#16a34a", // green
                        "#f59e0b", // amber
                        "#dc2626", // red
                      ].map((clr) => (
                        <button
                          key={clr}
                          className={`w-4 h-4 md:w-6 md:h-6 rounded-full border transition-all hover:scale-105 ${
                            clr === modernSettings.linkColor
                              ? "ring-2 ring-offset-1 ring-sky-500"
                              : ""
                          }`}
                          style={{ backgroundColor: clr }}
                          onClick={() =>
                            setModernSettings((prev) => ({
                              ...prev,
                              linkColor: clr,
                            }))
                          }
                          title={clr}
                        />
                      ))}
                    </div>

                    {/* Divider */}
                    <div className="w-px h-6 bg-gray-300 mx-2" />

                    {/* Custom Color Picker Circle */}
                    <div className="relative w-4 h-4 md:w-6 md:h-6 rounded-full overflow-hidden border cursor-pointer group">
                      <input
                        type="color"
                        value={modernSettings.linkColor || "#2563eb"}
                        onChange={(e) =>
                          setModernSettings((prev) => ({
                            ...prev,
                            linkColor: e.target.value,
                          }))
                        }
                        className="absolute inset-0 z-10 opacity-0 cursor-pointer"
                        title={t("templateControls.pickCustomColor")}
                      />
                      <div
                        className="absolute inset-0 z-0 rounded-full"
                        style={{
                          backgroundColor:
                            modernSettings.linkColor || "#2563eb",
                        }}
                      >
                        <MdOutlineColorize className="text-gray-500/50 text-xs md:text-lg drop-shadow absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Toggle Visibility Dropdown */}
          <div className="relative dropdown-container">
            <button
              className={`md:p-2 rounded-md align-middle hover:bg-gray-100 transition ${
                openDropdown === "toggle" ? "bg-gray-100" : ""
              }`}
              title={t("templateControls.showHideSections")}
              onClick={() =>
                setOpenDropdown((prev) => (prev === "toggle" ? null : "toggle"))
              }
            >
              <BiShowAlt className="text-lg md:text-xl text-gray-700" />
            </button>

            {openDropdown === "toggle" && (
              <div className="absolute right-0 mt-2 z-50 w-48 md:w-72 max-h-72 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="p-4">
                  <h3 className="text-[12px] md:text-sm font-semibold text-gray-800 mb-1.5 md:mb-3 flex items-center gap-1 md:gap-2">
                    <FaEye className="text-sky-700" />
                    Show/Hide Sections
                  </h3>

                  <div className="grid grid-cols-2 gap-1.5 md:gap-2">
                    {Object.keys(modernSettings.visibleSections).map(
                      (key) => {
                        const isVisible = modernSettings.visibleSections[key];
                        const label = key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase());

                        return (
                          <button
                            key={key}
                            onClick={() =>
                              setModernSettings((prev) => ({
                                ...prev,
                                visibleSections: {
                                  ...prev.visibleSections,
                                  [key]: !isVisible,
                                },
                              }))
                            }
                            className={`flex items-center justify-between px-1.5 md:px-3 py-1.5 rounded-md border text-[10px] md:text-xs transition-all ${
                              isVisible
                                ? "bg-sky-50 text-sky-700 border-sky-300 hover:bg-sky-100"
                                : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                            }`}
                          >
                            <span className="truncate w-10 md:w-24 text-left">
                              {label}
                            </span>
                            {isVisible ? (
                              <FaEye className="text-sky-500 text-sm shrink-0" />
                            ) : (
                              <FaEyeSlash className="text-gray-400 text-sm shrink-0" />
                            )}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Reorder Sections Dropdown */}
          <div className="relative dropdown-container">
            <button
              className={`md:p-2 align-middle rounded-md hover:bg-gray-100 transition ${
                openDropdown === "reorder" ? "bg-gray-100" : ""
              }`}
              title={t("templateControls.reorderSections")}
              onClick={() =>
                setOpenDropdown((prev) =>
                  prev === "reorder" ? null : "reorder"
                )
              }
            >
              <IoReorderThreeSharp className="text-lg md:text-xl text-gray-700" />
            </button>

            {openDropdown === "reorder" && (
              <div className="absolute right-0 mt-2 z-50 w-40 md:w-64 max-h-80 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="p-2.5 md:p-4">
                  <h3 className="text-[16px] md:text-sm font-semibold text-gray-800 mb-2 md:mb-3 flex items-center gap-2">
                    <IoReorderThreeSharp className="text-sky-700" />
                    Reorder Sections
                  </h3>

                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    modifiers={[restrictToVerticalAxis]} // 👈 restrict to vertical only
                    onDragEnd={({ active, over }) => {
                      if (!over || active.id === over.id) return;

                      const oldIndex = modernSettings.sectionOrder.indexOf(
                        active.id
                      );
                      const newIndex = modernSettings.sectionOrder.indexOf(
                        over.id
                      );
                      const newOrder = arrayMove(
                        modernSettings.sectionOrder,
                        oldIndex,
                        newIndex
                      );

                      setModernSettings((prev) => ({
                        ...prev,
                        sectionOrder: newOrder,
                      }));
                    }}
                  >
                    <SortableContext
                      items={modernSettings.sectionOrder}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-1.5">
                        {modernSettings.sectionOrder.map((id) => (
                          <SortableItem key={id} id={id} />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* {t("templateControls.resumePreview")} - A4 sized, scaled to fit container */}
      <div ref={scaleWrapperRef} className="m-3 mx-2.5 mb-2.5 a4-scale-wrapper">
        <div
          ref={contentRef}
          className="a4-page print-a4 leading-relaxed bg-white shadow-xl"
          style={{
            fontFamily:
              modernSettings.fontFamily || "var(--resume-body-modern)",
            backgroundColor: modernSettings.backgroundColor || "#ffffff",
            color: inkColor,
            flexDirection: "column",
          }}
        >
          {/* Inner Resume Container */}
          <div
            className={`flex flex-col h-full`}
            style={{
              padding: modernSettings.padding || "44px 56px",
              rowGap: `${modernSettings.sectionGap ?? 18}px`,
              border:
                modernSettings.borderWidth &&
                modernSettings.borderWidth !== "0px"
                  ? `${modernSettings.borderWidth} ${
                      modernSettings.borderStyle || "solid"
                    } ${modernSettings.borderColor || "#cbd5e1"}`
                  : "none",
            }}
          >
            {Array.isArray(modernSettings?.sectionOrder) &&
              modernSettings.sectionOrder.map(
                (sectionKey) =>
                  modernSettings.visibleSections?.[sectionKey] && (
                    <div
                      key={sectionKey}
                      className="break-inside-avoid"
                      style={{ pageBreakInside: "avoid" }}
                    >
                      {sectionMap[sectionKey]}
                    </div>
                  )
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;
