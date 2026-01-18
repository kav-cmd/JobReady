import { Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Star } from "lucide-react";
import { ResumeData, Skill } from "./ResumeQuestionnaire";

interface ResumeTemplateProps {
  data: ResumeData;
}

// Helper function to check if value is placeholder
const isPlaceholder = (value: string): boolean => {
  return (
    !value ||
    value.startsWith("Add ") ||
    value === "" ||
    value.toLowerCase() === "no data"
  );
};

// TEMPLATE 1: Modern Resume
export function ModernTemplate({ data }: ResumeTemplateProps) {
  return (
    <div className="min-h-screen bg-white p-12 font-sans" style={{ color: "#1a1a1a" }}>
      {/* Header */}
      <div className="mb-8 pb-6 border-b-4" style={{ borderColor: "#3b82f6" }}>
        <h1 className="text-4xl font-bold" style={{ color: "#1a1a1a" }}>
          {!isPlaceholder(data.name) ? data.name : "Your Name"}
        </h1>
        <p
          className="text-xl mt-2"
          style={{ color: "#3b82f6" }}
        >
          {!isPlaceholder(data.title) ? data.title : "Professional Title"}
        </p>
        <div className="flex gap-6 mt-4 text-sm" style={{ color: "#666" }}>
          {!isPlaceholder(data.email) && (
            <span>
              <strong>Email:</strong> {data.email}
            </span>
          )}
          {!isPlaceholder(data.phone) && (
            <span>
              <strong>Phone:</strong> {data.phone}
            </span>
          )}
          {!isPlaceholder(data.location) && (
            <span>
              <strong>Location:</strong> {data.location}
            </span>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {!isPlaceholder(data.summary) && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3" style={{ color: "#3b82f6" }}>
            PROFESSIONAL SUMMARY
          </h2>
          <p style={{ color: "#666", lineHeight: "1.6" }}>{data.summary}</p>
        </section>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4" style={{ color: "#3b82f6" }}>
            SKILLS
          </h2>
          <div className="grid grid-cols-2 gap-6">
            {data.skills.map((skill, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{skill.name}</span>
                  <span style={{ color: "#666" }}>{skill.level}%</span>
                </div>
                <div
                  className="h-2 rounded-full"
                  style={{ backgroundColor: "#e5e7eb" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${skill.level}%`,
                      backgroundColor: "#3b82f6",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4" style={{ color: "#3b82f6" }}>
            EXPERIENCE
          </h2>
          <div className="space-y-6">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-lg font-bold">{exp.jobTitle}</h3>
                  <span style={{ color: "#666" }}>{exp.duration}</span>
                </div>
                <p style={{ color: "#3b82f6" }} className="font-medium">
                  {exp.company}
                </p>
                <p style={{ color: "#666", marginTop: "8px", lineHeight: "1.6" }}>
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education &&
        data.education.length > 0 &&
        data.education.some((edu) => !isPlaceholder(edu.degree)) && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: "#3b82f6" }}>
              EDUCATION
            </h2>
            <div className="space-y-4">
              {data.education.map(
                (edu, index) =>
                  !isPlaceholder(edu.degree) && (
                    <div key={index}>
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-lg font-bold">{edu.degree}</h3>
                        <span style={{ color: "#666" }}>{edu.year}</span>
                      </div>
                      <p style={{ color: "#3b82f6" }}>{edu.institution}</p>
                    </div>
                  )
              )}
            </div>
          </section>
        )}

      {/* Certifications */}
      {data.certifications &&
        data.certifications.length > 0 &&
        data.certifications.some((cert) => !isPlaceholder(cert)) && (
          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ color: "#3b82f6" }}>
              CERTIFICATIONS
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.certifications.map(
                (cert, index) =>
                  !isPlaceholder(cert) && (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full text-sm"
                      style={{
                        backgroundColor: "#dbeafe",
                        color: "#1e40af",
                      }}
                    >
                      {cert}
                    </span>
                  )
              )}
            </div>
          </section>
        )}
    </div>
  );
}

// TEMPLATE 2: Minimal/ATS-Friendly Resume
export function MinimalTemplate({ data }: ResumeTemplateProps) {
  return (
    <div className="min-h-screen bg-white p-8 font-serif" style={{ color: "#000" }}>
      {/* Header */}
      <div className="mb-6 text-center border-b pb-4">
        <h1 className="text-3xl font-bold">
          {!isPlaceholder(data.name) ? data.name : "YOUR NAME"}
        </h1>
        <p className="text-lg">{!isPlaceholder(data.title) ? data.title : ""}</p>
        <div className="text-sm mt-2 space-y-0.5">
          {!isPlaceholder(data.email) && <p>{data.email}</p>}
          {!isPlaceholder(data.phone) && <p>{data.phone}</p>}
          {!isPlaceholder(data.location) && <p>{data.location}</p>}
        </div>
      </div>

      {/* Professional Summary */}
      {!isPlaceholder(data.summary) && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase border-b pb-2 mb-3">
            Professional Summary
          </h2>
          <p style={{ lineHeight: "1.5" }}>{data.summary}</p>
        </section>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase border-b pb-2 mb-3">
            Work Experience
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between">
                  <span className="font-bold">{exp.jobTitle}</span>
                  <span>{exp.duration}</span>
                </div>
                <p>{exp.company}</p>
                <p style={{ whiteSpace: "pre-wrap" }}>{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education &&
        data.education.length > 0 &&
        data.education.some((edu) => !isPlaceholder(edu.degree)) && (
          <section className="mb-6">
            <h2 className="text-sm font-bold uppercase border-b pb-2 mb-3">
              Education
            </h2>
            <div className="space-y-2">
              {data.education.map(
                (edu, index) =>
                  !isPlaceholder(edu.degree) && (
                    <div key={index}>
                      <div className="flex justify-between">
                        <span className="font-bold">{edu.degree}</span>
                        <span>{edu.year}</span>
                      </div>
                      <p>{edu.institution}</p>
                    </div>
                  )
              )}
            </div>
          </section>
        )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase border-b pb-2 mb-3">
            Skills
          </h2>
          <p>
            {data.skills
              .map((skill) => `${skill.name} (${skill.level}%)`)
              .join(" • ")}
          </p>
        </section>
      )}

      {/* Certifications */}
      {data.certifications &&
        data.certifications.length > 0 &&
        data.certifications.some((cert) => !isPlaceholder(cert)) && (
          <section>
            <h2 className="text-sm font-bold uppercase border-b pb-2 mb-3">
              Certifications
            </h2>
            <ul style={{ marginLeft: "20px" }}>
              {data.certifications.map(
                (cert, index) =>
                  !isPlaceholder(cert) && (
                    <li key={index} style={{ listStyleType: "disc" }}>
                      {cert}
                    </li>
                  )
              )}
            </ul>
          </section>
        )}
    </div>
  );
}

// TEMPLATE 3: Creative Resume
export function CreativeTemplate({ data }: ResumeTemplateProps) {
  return (
    <div className="min-h-screen bg-white p-10 font-sans" style={{ color: "#1a1a1a" }}>
      {/* Header with colored background */}
      <div
        className="p-8 rounded-lg mb-8 text-white"
        style={{ backgroundColor: "#7c3aed" }}
      >
        <h1 className="text-5xl font-bold mb-2">
          {!isPlaceholder(data.name) ? data.name : "Your Name"}
        </h1>
        <p className="text-2xl opacity-90">
          {!isPlaceholder(data.title) ? data.title : "Professional Title"}
        </p>
        <div className="flex gap-6 mt-6 text-sm opacity-90">
          {!isPlaceholder(data.email) && <span>{data.email}</span>}
          {!isPlaceholder(data.phone) && <span>{data.phone}</span>}
          {!isPlaceholder(data.location) && <span>{data.location}</span>}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-3 gap-8">
        {/* Left Column */}
        <div>
          {/* Quick Skills */}
          {data.skills && data.skills.length > 0 && (
            <section className="mb-8">
              <h2
                className="text-lg font-bold mb-4 pb-2 border-b-2"
                style={{ borderColor: "#7c3aed" }}
              >
                TOP SKILLS
              </h2>
              <div className="space-y-3">
                {data.skills.slice(0, 5).map((skill, index) => (
                  <div key={index}>
                    <div className="text-sm font-medium mb-1">{skill.name}</div>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-2 w-2 rounded-full"
                          style={{
                            backgroundColor:
                              i < Math.round(skill.level / 20)
                                ? "#7c3aed"
                                : "#e5e7eb",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {data.certifications &&
            data.certifications.length > 0 &&
            data.certifications.some((cert) => !isPlaceholder(cert)) && (
              <section>
                <h2
                  className="text-lg font-bold mb-4 pb-2 border-b-2"
                  style={{ borderColor: "#7c3aed" }}
                >
                  CERTIFICATIONS
                </h2>
                <div className="space-y-2 text-sm">
                  {data.certifications.map(
                    (cert, index) =>
                      !isPlaceholder(cert) && (
                        <div key={index} className="flex items-start gap-2">
                          <div
                            className="w-2 h-2 rounded-full mt-1 flex-shrink-0"
                            style={{ backgroundColor: "#7c3aed" }}
                          />
                          <span>{cert}</span>
                        </div>
                      )
                  )}
                </div>
              </section>
            )}
        </div>

        {/* Right Column */}
        <div className="col-span-2 space-y-8">
          {/* Professional Summary */}
          {!isPlaceholder(data.summary) && (
            <section>
              <h2
                className="text-lg font-bold mb-3 pb-2 border-b-2"
                style={{ borderColor: "#7c3aed" }}
              >
                ABOUT ME
              </h2>
              <p style={{ lineHeight: "1.6", color: "#666" }}>{data.summary}</p>
            </section>
          )}

          {/* Experience */}
          {data.experience && data.experience.length > 0 && (
            <section>
              <h2
                className="text-lg font-bold mb-4 pb-2 border-b-2"
                style={{ borderColor: "#7c3aed" }}
              >
                EXPERIENCE
              </h2>
              <div className="space-y-4">
                {data.experience.map((exp, index) => (
                  <div key={index} className="flex gap-4">
                    <div
                      className="w-1 flex-shrink-0"
                      style={{ backgroundColor: "#7c3aed" }}
                    />
                    <div>
                      <h3 className="font-bold">{exp.jobTitle}</h3>
                      <p style={{ color: "#7c3aed", fontSize: "0.875rem" }}>
                        {exp.company} • {exp.duration}
                      </p>
                      <p style={{ color: "#666", marginTop: "4px", fontSize: "0.875rem" }}>
                        {exp.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {data.education &&
            data.education.length > 0 &&
            data.education.some((edu) => !isPlaceholder(edu.degree)) && (
              <section>
                <h2
                  className="text-lg font-bold mb-4 pb-2 border-b-2"
                  style={{ borderColor: "#7c3aed" }}
                >
                  EDUCATION
                </h2>
                <div className="space-y-3">
                  {data.education.map(
                    (edu, index) =>
                      !isPlaceholder(edu.degree) && (
                        <div key={index}>
                          <h3 className="font-bold">{edu.degree}</h3>
                          <p style={{ color: "#666", fontSize: "0.875rem" }}>
                            {edu.institution} • {edu.year}
                          </p>
                        </div>
                      )
                  )}
                </div>
              </section>
            )}
        </div>
      </div>
    </div>
  );
}
