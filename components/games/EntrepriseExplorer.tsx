"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { motion } from "framer-motion";
import { ArrowRight, Check, X } from "lucide-react";
import { useGameShell } from "./game-shell-context";

const ACCENT = "var(--pivot)";

// ─── Données : 12 entreprises × 3 axes ────────────────────────────────────
type Axis = "legal" | "sector" | "size";
type LegalForm = "EI" | "SAS" | "SA" | "EPIC" | "SCOP";
type Sector = "primaire" | "secondaire" | "tertiaire";
type Size = "Micro" | "PME" | "ETI" | "GE";

type Company = {
  id: string;
  name: string;
  legal: LegalForm;
  sector: Sector;
  size: Size;
};

const COMPANIES: Company[] = [
  { id: "sncf", name: "SNCF", legal: "EPIC", sector: "tertiaire", size: "GE" },
  {
    id: "bk",
    name: "Burger King",
    legal: "SAS",
    sector: "tertiaire",
    size: "GE",
  },
  {
    id: "boulanger",
    name: "Boulanger artisan local",
    legal: "EI",
    sector: "secondaire",
    size: "Micro",
  },
  { id: "edf", name: "EDF", legal: "SA", sector: "secondaire", size: "GE" },
  {
    id: "lecreuset",
    name: "Le Creuset",
    legal: "SAS",
    sector: "secondaire",
    size: "ETI",
  },
  {
    id: "sephora",
    name: "Sephora",
    legal: "SAS",
    sector: "tertiaire",
    size: "GE",
  },
  {
    id: "renault",
    name: "Renault",
    legal: "SA",
    sector: "secondaire",
    size: "GE",
  },
  {
    id: "ae",
    name: "Auto-entrepreneur consultant",
    legal: "EI",
    sector: "tertiaire",
    size: "Micro",
  },
  {
    id: "scop",
    name: "Coopérative agricole locale",
    legal: "SCOP",
    sector: "primaire",
    size: "PME",
  },
  {
    id: "doctolib",
    name: "Doctolib",
    legal: "SAS",
    sector: "tertiaire",
    size: "ETI",
  },
  { id: "total", name: "Total", legal: "SA", sector: "secondaire", size: "GE" },
  {
    id: "plombier",
    name: "Plombier indépendant",
    legal: "EI",
    sector: "secondaire",
    size: "Micro",
  },
];

const AXES: Record<Axis, { label: string; sub: string; values: string[] }> = {
  legal: {
    label: "Forme juridique",
    sub: "EI / SAS / SA / EPIC / SCOP",
    values: ["EI", "SAS", "SA", "EPIC", "SCOP"],
  },
  sector: {
    label: "Secteur d'activité",
    sub: "Primaire / Secondaire / Tertiaire",
    values: ["primaire", "secondaire", "tertiaire"],
  },
  size: {
    label: "Taille",
    sub: "Micro / PME / ETI / GE",
    values: ["Micro", "PME", "ETI", "GE"],
  },
};

const SECTOR_LABELS: Record<Sector, string> = {
  primaire: "Primaire",
  secondaire: "Secondaire",
  tertiaire: "Tertiaire",
};

type Placements = Record<string, Partial<Record<Axis, string>>>;

// ─── Component ─────────────────────────────────────────────────────────────
export default function EntrepriseExplorer() {
  const shell = useGameShell();
  const [axis, setAxis] = useState<Axis>("legal");
  const [placements, setPlacements] = useState<Placements>({});
  const [validated, setValidated] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  );

  const totalAxesPlaced = useMemo(
    () =>
      COMPANIES.reduce(
        (sum, c) =>
          sum +
          (placements[c.id]?.legal ? 1 : 0) +
          (placements[c.id]?.sector ? 1 : 0) +
          (placements[c.id]?.size ? 1 : 0),
        0,
      ),
    [placements],
  );

  const allDone = totalAxesPlaced === 36;

  function onDragEnd(e: DragEndEvent) {
    setActiveId(null);
    if (!e.over || validated) return;
    const companyId = e.active.id as string;
    const zoneValue = e.over.id as string;
    if (zoneValue === "pool") {
      // Remove placement for current axis
      setPlacements((prev) => ({
        ...prev,
        [companyId]: { ...prev[companyId], [axis]: undefined },
      }));
      return;
    }
    setPlacements((prev) => ({
      ...prev,
      [companyId]: { ...prev[companyId], [axis]: zoneValue },
    }));
  }

  function validate() {
    if (!allDone || validated) return;
    let correct = 0;
    COMPANIES.forEach((c) => {
      if (placements[c.id]?.legal === c.legal) correct++;
      if (placements[c.id]?.sector === c.sector) correct++;
      if (placements[c.id]?.size === c.size) correct++;
    });
    const score = Math.round((correct / 36) * 100);
    setValidated(true);
    setTimeout(() => {
      shell.complete(
        {
          analyse: Math.min(100, 30 + score / 3),
          rigueur: Math.min(100, 25 + score / 3),
        },
        score,
        { correct, total: 36 },
      );
    }, 1500);
  }

  // Cards à afficher dans le pool (= pas encore placées pour l'axe courant)
  const poolCompanies = COMPANIES.filter((c) => !placements[c.id]?.[axis]);

  const meta = AXES[axis];

  return (
    <div className="max-w-[1300px] mx-auto">
      {/* Tabs onglets */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {(Object.keys(AXES) as Axis[]).map((a) => {
          const placedForAxis = COMPANIES.filter(
            (c) => placements[c.id]?.[a],
          ).length;
          const isActive = a === axis;
          return (
            <button
              key={a}
              onClick={() => setAxis(a)}
              className="px-4 py-2.5 rounded-2xl border-2 font-display font-semibold text-sm md:text-base whitespace-nowrap transition-colors"
              style={{
                borderColor: isActive ? ACCENT : "var(--night-200)",
                background: isActive ? `${ACCENT}1f` : "transparent",
                color: isActive ? ACCENT : "var(--snow)",
              }}
            >
              {AXES[a].label}{" "}
              <span className="font-mono text-[10px] opacity-60 ml-1">
                {placedForAxis}/12
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-snow/60 text-sm mb-4">
        Onglet actif : <strong className="text-snow">{meta.label}</strong> ·{" "}
        Glisse les 12 entreprises dans la bonne case. Tu valides à la fin une
        fois les 3 axes complets.
      </p>

      <DndContext
        sensors={sensors}
        onDragStart={(e) => setActiveId(e.active.id as string)}
        onDragEnd={onDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        {/* Drop zones (axe courant) */}
        <div
          className="grid gap-3 mb-6"
          style={{
            gridTemplateColumns: `repeat(${meta.values.length}, minmax(0, 1fr))`,
          }}
        >
          {meta.values.map((v) => (
            <Zone
              key={v}
              id={v}
              label={
                axis === "sector"
                  ? SECTOR_LABELS[v as Sector]
                  : v
              }
              companies={COMPANIES.filter((c) => placements[c.id]?.[axis] === v)}
              axis={axis}
              validated={validated}
              placements={placements}
            />
          ))}
        </div>

        {/* Pool */}
        <Pool companies={poolCompanies} validated={validated} />

        <DragOverlay>
          {activeId ? (
            <CompanyPill
              name={COMPANIES.find((c) => c.id === activeId)?.name ?? ""}
              floating
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="font-mono text-[11px] uppercase tracking-widest text-snow/50">
          // Total placés (3 axes) : {totalAxesPlaced} / 36
        </div>

        <button
          onClick={validate}
          disabled={!allDone || validated}
          className="inline-flex items-center justify-center gap-2 bg-pivot text-snow font-bold px-7 py-4 rounded-2xl text-base disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:scale-[1.01]"
          style={{
            boxShadow: allDone && !validated ? "0 0 24px var(--pivot)" : "none",
          }}
        >
          {validated
            ? "Sauvegarde..."
            : allDone
              ? "Valider mes classements"
              : `Place encore ${36 - totalAxesPlaced} (sur 3 axes)`}
          {allDone && !validated && <ArrowRight className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}

// ─── Zone / Pool / Pill ───────────────────────────────────────────────────
function Zone({
  id,
  label,
  companies,
  axis,
  validated,
  placements,
}: {
  id: string;
  label: string;
  companies: Company[];
  axis: Axis;
  validated: boolean;
  placements: Placements;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className="rounded-3xl border-2 p-3 min-h-[180px] transition-colors"
      style={{
        borderColor: isOver ? ACCENT : "var(--night-200)",
        background: isOver ? `${ACCENT}10` : "var(--night-soft)",
      }}
    >
      <div
        className="font-display font-bold text-base mb-2 text-center"
        style={{ color: ACCENT }}
      >
        {label}
      </div>
      <div className="space-y-1.5">
        {companies.map((c) => (
          <DraggableCompany
            key={c.id}
            company={c}
            validated={validated}
            isCorrect={
              validated ? placements[c.id]?.[axis] === c[axis] : undefined
            }
          />
        ))}
        {companies.length === 0 && (
          <div className="font-mono text-[9px] uppercase tracking-widest text-night-500 text-center py-4">
            Glisse ici
          </div>
        )}
      </div>
    </div>
  );
}

function Pool({
  companies,
  validated,
}: {
  companies: Company[];
  validated: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: "pool" });
  return (
    <div
      ref={setNodeRef}
      className="rounded-3xl border-2 border-dashed p-4 transition-colors"
      style={{
        borderColor: isOver ? ACCENT : "var(--night-200)",
        background: isOver ? `${ACCENT}08` : "transparent",
      }}
    >
      <div
        className="font-mono text-[10px] uppercase tracking-widest mb-3"
        style={{ color: ACCENT }}
      >
        // À placer · {companies.length}
      </div>
      <div className="flex flex-wrap gap-2">
        {companies.map((c) => (
          <DraggableCompany key={c.id} company={c} validated={validated} />
        ))}
        {companies.length === 0 && (
          <p className="text-snow/50 text-sm w-full text-center py-2">
            Toutes placées sur cet axe.
          </p>
        )}
      </div>
    </div>
  );
}

function DraggableCompany({
  company,
  validated,
  isCorrect,
}: {
  company: Company;
  validated: boolean;
  isCorrect?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: company.id, disabled: validated });
  const style: React.CSSProperties = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.4 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <CompanyPill
        name={company.name}
        validated={validated}
        isCorrect={isCorrect}
      />
    </div>
  );
}

function CompanyPill({
  name,
  validated,
  isCorrect,
  floating,
}: {
  name: string;
  validated?: boolean;
  isCorrect?: boolean;
  floating?: boolean;
}) {
  let borderColor = "var(--night-200)";
  let textColor = "var(--snow)";
  if (validated) {
    if (isCorrect === true) {
      borderColor = "var(--mint)";
      textColor = "var(--mint)";
    } else if (isCorrect === false) {
      borderColor = "var(--coral)";
      textColor = "var(--coral)";
    }
  }
  return (
    <motion.div
      layout
      className="px-3 py-2 rounded-2xl border-2 text-xs md:text-sm bg-night/80 select-none flex items-start gap-1.5"
      style={{
        borderColor,
        color: textColor,
        cursor: validated ? "default" : "grab",
        boxShadow: floating
          ? `0 20px 40px rgba(0,0,0,0.5), 0 0 16px ${ACCENT}`
          : undefined,
      }}
    >
      {validated && isCorrect === true && (
        <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" strokeWidth={2.5} />
      )}
      {validated && isCorrect === false && (
        <X className="w-3.5 h-3.5 shrink-0 mt-0.5" strokeWidth={2.5} />
      )}
      <span className="leading-snug">{name}</span>
    </motion.div>
  );
}
