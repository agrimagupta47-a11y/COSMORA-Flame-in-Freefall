# Cosmora — Flame in Freefall

**AI-Powered Microgravity Combustion & Habitat Fire Safety Intelligence Platform**  
*Built for the NASA Space Apps Challenge 2026 — "Flame in Freefall: AI-Powered Fire Safety Insights from Microgravity Combustion Data"*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-cosmora--flame--in--freefall.vercel.app-0284C7?style=for-the-badge&logo=vercel)](https://cosmora-flame-in-freefall.vercel.app/)
[![GitHub Repository](https://img.shields.io/badge/GitHub-agrimagupta47--a11y%2FCOSMORA-0B1120?style=for-the-badge&logo=github)](https://github.com/agrimagupta47-a11y/COSMORA)
[![Powered by NASA PSI](https://img.shields.io/badge/Data-NASA%20PSI%20Repository-EA580C?style=for-the-badge)](https://psi.nasa.gov/)

---

## Overview

In microgravity (`0g`), natural buoyant convection disappears. Instead of rising as flickering teardrops, flames form calm, spherical diffusion structures—including low-temperature **"cool flames"**—driven purely by molecular diffusion and spacecraft cabin airflow. At the same time, planned **Artemis lunar bases and pressurized rovers** will operate at elevated oxygen concentrations ($\ge 30\%\text{ O}_2$) and reduced pressures ($\le 10.2\text{ psi}$), dramatically increasing material flammability and ignition risk.

**Cosmora — Flame in Freefall** transforms decades of complex NASA Physical Sciences Informatics (PSI) microgravity combustion investigations into an interactive mission-planning simulator and grounded AI safety copilot for aerospace engineers, researchers, and students.

**Live Application:** [https://cosmora-flame-in-freefall.vercel.app/](https://cosmora-flame-in-freefall.vercel.app/)

---

## Key Features

### 1. Mission Preset Ranker & Partial-Gravity Guardrails
* Evaluates and ranks **12 core NASA PSI combustion investigations** across real exploration profiles: **Lunar Base ($\ge 30\%\text{ O}_2$, $\le 10.2\text{ psi}$)**, **ISS ($21\%\text{ O}_2$, $14.7\text{ psi}$)**, **Pressurized Rover**, and **EVA Spacesuit ($100\%\text{ O}_2$, $4.3\text{ psi}$)**.
* Enforces explicit **scientific validity guardrails**, transparently bounding lunar partial-gravity (`1/6g`) risk using `0g` + `1g` bounds and electric-field flame studies (`ACME E-FIELD Flames`) ahead of upcoming NASA **LUCI** and **FM2** lunar combustion datasets.

### 2. Interactive $\text{O}_2\%$ vs. Pressure (PSI) Atmosphere Simulator
* Plots historical spaceflight fires (**Apollo 1**, **Apollo 13**, **Mir 1997**), habitat zones, and NASA PSI experimental test envelopes on an interactive scatter matrix.
* Includes a custom **Oxygen Concentration & Ambient Pressure dial** with one-click mission presets that trigger live **Groq AI Fire Safety & Suppression Briefings** detailing ignition hazards, extinguishment strategies ($\text{CO}_2$, Helium, airflow control), and partial-gravity caveats.
* Features a visual **`1g` Buoyant Teardrop vs. `0g` Spherical Diffusion Flame** comparison grounded in NASA ScienceCast microgravity physics.

### 3. Side-by-Side Experiment Matrix & AI Comparison
* Filterable database of 12 PSI investigations spanning **CIR** (Combustion Integrated Rack), **MSG** (Microgravity Science Glovebox), **MDCA** (Multi-user Droplet Combustion Apparatus), and **Cygnus**.
* Select any two investigations to generate a structured **AI Engineering Diff** comparing fuel phases, oxygen thresholds, hardware constraints, and fire-safety takeaways.

### 4. Grounded NASA PSI Copilot (`Engineer` & `Student` Modes)
* Retrieval-augmented conversational assistant powered by **Groq (`Llama-3.3-70B-versatile`)** with deterministic PSI investigation ID citations (`[PSI-159]`, `[PSI-25]`, `[PSI-98]`, `[PSI-69]`, `[PSI-101]`, etc.).
* Supports an audience persona toggle switching between concise aerospace engineering specifications and accessible educational explanations.

### 5. Spaceflight Fire History & Terrestrial Spinoff Mapping
* Connects orbital fire lessons (Apollo 1, Apollo 13, Mir) and microgravity combustion research directly to **NASA terrestrial firefighting spinoffs**:
  * **Pre-Combustion Early-Warning Smoke Detectors** (`Spinoff node/9407` + `SAME-R` aerosol particle sizing)
  * **13-lb Lighter Composite Firefighter Air Tanks** (`Spinoff node/9582` aerospace pressure-vessel technology)
  * **Thermal-Protective Firefighter Turnout Gear** (`Spinoff node/9918` + `BASS` / `Saffire` material flammability research)

---

## NASA Open Data & Investigations Indexed

| Safety Pillar | NASA PSI Investigations | Flight Hardware | Research Focus |
| :--- | :--- | :--- | :--- |
| **Prevention & Solid Flammability** | `BASS` (PSI-26), `BASS-II` (PSI-25), `Saffire-I/II/III` (PSI-98–100) | MSG, Cygnus | Cotton-fiberglass, PMMA, Nomex, and large-scale spacecraft material flame spread |
| **High-$\text{O}_2$ & Cool Flames** | `ACME CFI-G` (PSI-159), `Flame Design` (PSI-10), `E-FIELD Flames` | CIR | Gaseous spherical diffusion flames up to $85\%\text{ O}_2$, soot control, and electric-field body forces |
| **Suppression & Droplets** | `FLEX` (PSI-69), `CFI` (PSI-142) | CIR / MDCA | Droplet burning, radiative extinction, and $\text{CO}_2$ / Helium suppressant effectiveness |
| **Smoke & Aerosol Detection** | `SAME` (PSI-102), `SAME-R` (PSI-101), `DAFT` | MSG / ISS | Smoke particulate size distributions for early detection and false-alarm reduction |

---

## Tech Stack

* **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS
* **Data Visualization:** Recharts (Interactive $\text{O}_2\%$ vs. Pressure PSI Scatter & Envelope Simulator)
* **AI & Inference:** Groq SDK (`llama-3.3-70b-versatile`) with structured JSON mode & PSI dataset grounding
* **Deployment:** Vercel (`https://cosmora-flame-in-freefall.vercel.app/`)

---

## Running Locally

### 1. Clone the Repository
```bash
git clone [https://github.com/agrimagupta47-a11y/COSMORA.git](https://github.com/agrimagupta47-a11y/COSMORA.git)
cd COSMORA
