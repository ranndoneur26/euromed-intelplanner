"use client";

import { useState } from "react";
import { Target, Sparkles, AlertCircle, CheckCircle, Zap } from "lucide-react";
import styles from "./page.module.css";
import { useLanguage } from "@/context/LanguageContext";
import { useGravity } from "@/context/GravityContext";

interface Recommendation {
    title: string;
    description: string;
}

interface StrategyResult {
    missionCritical: string;
    recommendations: Recommendation[];
}

export default function StrategyPage() {
    const { t, lang } = useLanguage();
    const { seed, completeStep } = useGravity();
    const [market, setMarket] = useState("");
    const [budget, setBudget] = useState("");
    const [campaignType, setCampaignType] = useState("impact");
    const [loading, setLoading] = useState(false);
    const [deepDiveLoading, setDeepDiveLoading] = useState(false);
    const [deepDiveResult, setDeepDiveResult] = useState("");
    const [result, setResult] = useState<StrategyResult | null>(null);
    const [error, setError] = useState("");

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setResult(null);

        const budgetValue = parseFloat(budget);

        // Logic Validation
        if (isNaN(budgetValue) || budgetValue < 5000) {
            setError(t("minBudgetError"));
            return;
        }

        setLoading(true);

        // Mock AI Delay
        setTimeout(() => {
            let mission = "";
            let recommendations: Recommendation[] = [];

            // Helper to format currency
            const fmtBudget = (b: number) => b.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });

            // Detect specific Euromed assets
            // Detect specific Euromed assets (Using SEED)
            const assetLower = seed.toLowerCase();
            const isPomanox = assetLower.includes("pomanox") || assetLower.includes("pomegranate") || assetLower.includes("granada");
            const isMilkThistle = assetLower.includes("milk thistle") || assetLower.includes("silymarin") || assetLower.includes("cardo") || assetLower.includes("silimarina");
            const isWellemon = assetLower.includes("wellemon") || assetLower.includes("lemon") || assetLower.includes("limon") || assetLower.includes("eriocitrin");

            // Detect Region for Event Customization
            const marketLower = market.toLowerCase();
            const isUSA = marketLower.includes("usa") || marketLower.includes("us") || marketLower.includes("america");
            const isAsia = marketLower.includes("asia") || marketLower.includes("china") || marketLower.includes("japan") || marketLower.includes("japón") || marketLower.includes("japon") || marketLower.includes("korea");

            const eventName = isUSA ? "SupplySide West" : (isAsia ? "Hi Japan / CPHI China" : "Vitafoods Europe");

            // SPECIAL CASE: Wellemon in Asia (High Detail Request)
            if (isWellemon && isAsia) {
                if (lang === "es") {
                    mission = `Misión Crítica: Posicionar a Wellemon no como un ingrediente, sino como la solución tecnológica definitiva para la 'Salud Metabólica Preventiva' en Asia, capturando la demanda emergente 2024-2029 por nutracéuticos de alta eficacia que combaten el estilo de vida sedentario urbano.`;
                    recommendations = [
                        {
                            title: "Micro-segmentación Geográfica y Digital (Japón y China)",
                            description: `Con un presupuesto ajustado de ${fmtBudget(budgetValue)}, es inviable una cobertura pan-asiática. Se recomienda una inversión 100% digital B2B (WeChat y LinkedIn) dirigida a directores de I+D y compras en Japón (foco en alimentos funcionales FFC) y China (foco en salud metabólica), alineándose con la tendencia de Technavio sobre el crecimiento de ingredientes para el control glucémico y la salud cardiovascular en poblaciones envejecidas.`
                        },
                        {
                            title: "Narrativa de 'Biodisponibilidad Superior'",
                            description: "El mercado asiático está saturado de extractos cítricos genéricos y MTC (Medicina Tradicional China). La campaña debe diferenciarse radicalmente enfocándose en la farmacocinética de la eriocitrina de Wellemon frente a la hesperidina común, posicionándolo como la evolución científica de los cítricos tradicionales para justificar un precio premium."
                        },
                        {
                            title: "Activación de Liderazgo Intelectual",
                            description: "En lugar de publicidad gráfica tradicional, invertir en la creación y promoción paga de un 'White Paper' técnico localizado y un webinar exclusivo en plataformas como FoodNavigator-Asia, presentando estudios clínicos sobre salud vascular; esto genera confianza inmediata en un mercado que prioriza la validación científica sobre el marketing emocional."
                        }
                    ];
                } else if (lang === "ca") {
                    mission = `Missió Crítica: Posicionar Wellemon no com un ingredient, sinó com la solució tecnològica definitiva per a la 'Salut Metabòlica Preventiva' a Àsia, capturant la demanda emergent 2024-2029 per nutracèutics d'alta eficàcia que combaten l'estil de vida sedentari urbà.`;
                    recommendations = [
                        {
                            title: "Micro-segmentació Geogràfica i Digital (Japó i Xina)",
                            description: `Amb un pressupost ajustat de ${fmtBudget(budgetValue)}, és inviable una cobertura pan-asiàtica. Es recomana una inversió 100% digital B2B (WeChat i LinkedIn) dirigida a directors d'I+D i compres al Japó (focus en aliments funcionals FFC) i Xina (focus en salut metabòlica), alineant-se amb la tendència de Technavio sobre el creixement d'ingredients per al control glucèmic i la salut cardiovascular en poblacions envellides.`
                        },
                        {
                            title: "Narrativa de 'Biodisponibilitat Superior'",
                            description: "El mercat asiàtic està saturat d'extractes cítrics genèrics i MTC (Medicina Tradicional Xinesa). La campanya s'ha de diferenciar radicalment enfocant-se en la farmacocinètica de l'eriocitrina de Wellemon enfront de l'hesperidina comuna, posicionant-lo com l'evolució científica dels cítrics tradicionals per justificar un preu prèmium."
                        },
                        {
                            title: "Activació de Lideratge Intel·lectual",
                            description: "En lloc de publicitat gràfica tradicional, invertir en la creació i promoció de pagament d'un 'White Paper' tècnic localitzat i un webinar exclusiu en plataformes com FoodNavigator-Asia, presentant estudis clínics sobre salut vascular; això genera confiança immediata en un mercat que prioritza la validació científica sobre el màrqueting emocional."
                        }
                    ];
                } else {
                    mission = `Critical Mission: Position Wellemon not as an ingredient, but as the definitive technological solution for 'Preventive Metabolic Health' in Asia, capturing the emerging 2024-2029 demand for high-efficacy nutraceuticals combatting the sedentary urban lifestyle.`;
                    recommendations = [
                        {
                            title: "Geographic & Digital Micro-segmentation (Japan & China)",
                            description: `With a tight budget of ${fmtBudget(budgetValue)}, pan-Asian coverage is unviable. We recommend 100% B2B digital investment (WeChat and LinkedIn) targeting R&D and purchasing directors in Japan (focus on FFC functional foods) and China (focus on metabolic health), aligning with Technavio trends on glycemic control and cardiovascular growth in aging populations.`
                        },
                        {
                            title: "'Superior Bioavailability' Narrative",
                            description: "The Asian market is saturated with generic citrus extracts and TCM (Traditional Chinese Medicine). The campaign must radically differentiate by focusing on Wellemon's eriocitrin pharmacokinetics vs. common hesperidin, positioning it as the scientific evolution of traditional citrus to justify a premium price point."
                        },
                        {
                            title: "Thought Leadership Activation",
                            description: "Instead of traditional display ads, invest in creating and promoting a localized technical 'White Paper' and exclusive webinar on platforms like FoodNavigator-Asia, presenting clinical studies on vascular health. This generates immediate trust in a market that prioritizes scientific validation over emotional marketing."
                        }
                    ];
                }
            } else if (lang === "es") {
                if (campaignType === "impact") {
                    let specificHook = "la excelencia botánica y la trazabilidad total del modelo 'Camp to Lab'";
                    if (isPomanox) specificHook = "la potencia antioxidante de los punicalaginos y su impacto clínico en la salud cardiovascular (Estudios Pomanox®)";
                    if (isMilkThistle) specificHook = "la estandarización precisa de silimarina, superando los estándares de la Farmacopea Europea";

                    mission = `Misión Crítica: Para lograr una penetración decisiva en el mercado de ${market}, la estrategia debe trascender la venta de ingredientes y vender 'Resultados de Salud Certificados'. Se recomienda un despliegue de alto impacto de ${seed}, apalancando ${specificHook}. El objetivo es disrumpir la inercia de compra actual centrada en el precio, estableciendo una nueva norma de calidad. Con una inversión de ${fmtBudget(budgetValue)}, la narrativa se centrará en la superioridad tecnológica del Pure-Hydro Process®, posicionando a ${seed} como la única solución premium viable que garantiza pureza y eficacia consistentes.`;

                    recommendations = [
                        {
                            title: `Dominio de Autoridad en ${eventName}`,
                            description: `Implementar una estrategia de presencia dominante. Más allá del stand, asegurar un slot de conferencia técnica ("Tech Talk") para presentar data comparativa de ${seed} vs. competidores genéricos. El objetivo es que cada interacción comercial comience con una base de superioridad técnica indiscutible.`
                        },
                        {
                            title: "Experiencia Sensorial y Funcional",
                            description: `Desarrollar kits de demostración "Ready-to-Market" que incluyan prototipos de producto final (ej. stick packs, gummies) formulados con ${seed}. Esto elimina la fricción de I+D para el cliente, demostrando que el ingrediente no solo es efectivo, sino también formulable y agradable al paladar.`
                        },
                        {
                            title: "Validación Externa Acelerada",
                            description: `Lanzar una campaña de PR digital centrada en la publicación de artículos en medios del sector (NutraIngredients, etc.) destacando el perfil de sostenibilidad (EcoVadis) y los estudios clínicos recientes de ${seed}. Usar estos activos para campañas de retargeting a decisores clave en LinkedIn.`
                        }
                    ];
                } else { // Maintenance
                    mission = `Estrategia de Fidelización: La estrategia para ${seed} en ${market} debe pivotar hacia la consolidación de 'Partnerships Estratégicos'. En un entorno competitivo, la defensa de la cuota de mercado se logra elevando el coste de cambio del cliente. Con un presupuesto de ${fmtBudget(budgetValue)}, la prioridad es integrar ${seed} profundamente en la narrativa de sostenibilidad y calidad del cliente final, haciendo que Euromed sea indispensable mediante servicios de valor añadido (soporte regulatorio, co-marketing).`;

                    recommendations = [
                        {
                            title: "Programa 'Euromed Insider'",
                            description: `Crear un canal exclusivo para clientes actuales de ${seed}, ofreciendo acceso anticipado a nuevos estudios clínicos y tendencias de mercado (Market Insights). Organizar sesiones trimestrales de innovación conjunta para explorar nuevas aplicaciones del ingrediente.`
                        },
                        {
                            title: "Soporte Técnico 'On-Demand'",
                            description: `Ofrecer horas de consultoría técnica gratuita para la reformulación o mejora de productos existentes con ${seed}. Posicionar al equipo técnico de Euromed como una extensión del laboratorio del cliente para resolver desafíos de estabilidad o solubilidad.`
                        },
                        {
                            title: "Integración de Sostenibilidad (EcoVadis)",
                            description: `Proveer assets de marketing listos para usar que destaquen la certificación EcoVadis Platinum y el origen sostenible de ${seed}. Ayudar a los clientes a comunicar estas ventajas en sus propios empaques y webs, vinculando su marca a los valores de Euromed.`
                        }
                    ];
                }
            } else if (lang === "ca") {
                if (campaignType === "impact") {
                    let specificHook = "l'excel·lència botànica i la traçabilitat total";
                    if (isPomanox) specificHook = "els beneficis cardiovasculars i d'envelliment saludable recolzats per estudis clínics del Pomanox®";
                    if (isMilkThistle) specificHook = "el lideratge mundial d'Euromed en extractes de Card Marià estandarditzats";

                    mission = `Per aconseguir una penetració decisiva al mercat de ${market}, l'estratègia s'ha de centrar en un desplegament d'alt impacte de ${seed}, apalancant ${specificHook}. L'objectiu principal és interrompre els patrons de consum actuals i establir una nova norma d'excel·lència basada en la filosofia 'Camp to Lab'. Aquesta campanya d'impacte utilitzarà una assignació pressupostària agressiva de ${fmtBudget(budgetValue)} per maximitzar la visibilitat a curt termini. La narrativa es centrarà en la innovació del Pure-Hydro Process® (extracció només amb aigua) i la puresa inigualable, posicionant ${seed} com l'única solució PhytoProof® viable per a les necessitats modernes del consumidor.`;

                    recommendations = [
                        {
                            title: `Domini a ${eventName} i Saturació Científica`,
                            description: `Implementar una estratègia de "Blitzscaling" amb un estand d'alt perfil a ${eventName}. No es tracta només de presència, sinó d'autoritat clínica. Organitzar un 'Scientific Breakfast' privat durant la fira per presentar els últims llibres blancs de ${seed} a directors de R&D clau.`
                        },
                        {
                            title: "Experiència Sensorial: Tasting Bar",
                            description: `Trencar la barrera de l'"ingredient invisible". Instal·lar un "Functional Tasting Bar" itinerant o en fira, oferint prototips acabats (gummies, shots) amb ${seed}. Això demostra la versatilitat de formulació i sabor superior gràcies al Pure-Hydro Process®, facilitant l'adopció immediata per part de marques de consum.`
                        },
                        {
                            title: "Conversió Accelerada via NutraIngredients Awards",
                            description: `Postular ${seed} als premis NutraIngredients Awards o equivalents regionals com a "Ingredient de l'Any". Utilitzar la nominació/victòria com a segell de validació en totes les campanyes de LinkedIn i materials de venda, reduint dràsticament el cicle de decisió de compradors escèptics.`
                        }
                    ];
                } else { // Maintenance
                    mission = `L'estratègia per a ${seed} a ${market} ha de pivotar cap a la consolidació i la lleialtat a llarg termini, reafirmant el compromís d'Euromed amb la qualitat i la sostenibilitat. En un enfocament de "Manteniment de Marca", es busca aprofundir la relació amb els partners actuals destacant la certificació EcoVadis Platinum. Amb un pressupost de ${fmtBudget(budgetValue)}, la prioritat és optimitzar el valor de vida del client (CLV) i reforçar les barreres de sortida mitjançant la innovació contínua en formats i aplicacions (ej. gummies, funcionals) per a ${seed}.`;

                    recommendations = [
                        {
                            title: "Reforç de la Comunitat 'Euromed Partner'",
                            description: `Transformar els clients actuals de ${seed} en ambaixadors. Organitzar visites exclusives a la planta de producció (Factory Tour) per a equips de qualitat de clients VIP. Això tangibiliza la diferència 'Camp to Lab' i crea un vincle emocional impossible de replicar per traders.`
                        },
                        {
                            title: "Webinars de Formulació Avançada",
                            description: `Desenvolupar una sèrie trimestral de webinars tècnics ("Formulation Clinics") enfocats a resoldre problemes d'estabilitat i sabor amb ${seed}. Posicionar Euromed no només com a proveïdor, sinó com una extensió del departament de R&D del client.`
                        },
                        {
                            title: "Sostenibilitat Verificable (EcoVadis)",
                            description: `Integrar les dades de petjada de carboni i certificacions EcoVadis als COA (Certificats d'Anàlisi) digitals. Ajudar els clients a assolir els seus propis objectius ESG utilitzant ${seed}, convertint l'ingredient en un actiu estratègic corporatiu més enllà de la seva funció nutricional.`
                        }
                    ];
                }
            } else {
                // English
                if (campaignType === "impact") {
                    let specificHook = "botanical excellence and total traceability";
                    if (isPomanox) specificHook = "cardiovascular/healthy-aging benefits backed by clinical studies of Pomanox®";
                    if (isMilkThistle) specificHook = "Euromed's global leadership in standardized Milk Thistle extracts";

                    mission = `Critical Mission: To achieve decisive penetration in the ${market} market, the strategy must center on a high-impact deployment of ${seed}, leveraging ${specificHook}. The primary objective is to disrupt current consumption patterns and establish a new standard of excellence based on the 'Camp to Lab' philosophy. This impact campaign will utilize an aggressive budget allocation of ${fmtBudget(budgetValue)} to maximize short-term visibility. The narrative will focus on the innovation of the Pure-Hydro Process® (water-only extraction) and unmatched purity, positioning ${seed} as the only viable PhytoProof® solution for modern consumer needs.`;

                    recommendations = [
                        {
                            title: `${eventName} Dominance & Scientific Saturation`,
                            description: `Implement a "Blitzscaling" strategy with a high-profile booth at ${eventName}. It is not just about presence, but clinical authority. Host a private 'Scientific Breakfast' during the fair to present the latest white papers on ${seed} to key R&D directors.`
                        },
                        {
                            title: "Sensory Experience: Tasting Bar",
                            description: `Break the "invisible ingredient" barrier. Install a "Functional Tasting Bar" (mobile or at the fair), offering finished prototypes (gummies, shots) containing ${seed}. This demonstrates formulation versatility and superior taste thanks to the Pure-Hydro Process®, facilitating immediate adoption by consumer brands.`
                        },
                        {
                            title: "Accelerated Conversion via NutraIngredients Awards",
                            description: `Submit ${seed} to the NutraIngredients Awards or regional equivalents as "Ingredient of the Year." Use the nomination/win as a validation seal in all LinkedIn campaigns and sales materials, drastically reducing the decision cycle for skeptical buyers.`
                        }
                    ];
                } else {
                    mission = `The strategy for ${seed} in ${market} must pivot towards consolidation and long-term loyalty, reaffirming Euromed's commitment to quality and sustainability. In a "Brand Maintenance" approach, the goal is to deepen relationships with current partners by highlighting the EcoVadis Platinum certification. With a budget of ${fmtBudget(budgetValue)}, the priority is optimizing Customer Lifetime Value (CLV) and reinforcing exit barriers through continuous innovation in formats and applications (e.g., gummies, functionals) for ${seed}.`;

                    recommendations = [
                        {
                            title: "'Euromed Partner' Community Reinforcement",
                            description: `Transform current ${seed} customers into ambassadors. Organize exclusive Factory Tours for VIP client quality teams. This tangibilizes the 'Camp to Lab' difference and creates an emotional bond impossible for traders to replicate.`
                        },
                        {
                            title: "Advanced Formulation Webinars",
                            description: `Develop a quarterly series of technical webinars ("Formulation Clinics") focused on solving stability and taste issues with ${seed}. Position Euromed not just as a vendor, but as an extension of the client's R&D department.`
                        },
                        {
                            title: "Verifiable Sustainability (EcoVadis)",
                            description: `Integrate carbon footprint data and EcoVadis certifications into digital COAs (Certificates of Analysis). Help customers achieve their own ESG goals using ${seed}, turning the ingredient into a strategic corporate asset beyond its nutritional function.`
                        }
                    ];
                }
            }

            const finalResult = {
                missionCritical: mission,
                recommendations: recommendations
            };
            setResult(finalResult);
            completeStep("strategy", finalResult);
            setLoading(false);
        }, 2000);
    };

    const handleDeepDive = () => {
        setDeepDiveLoading(true);
        // Simulated Dual-AI Processing
        setTimeout(() => {
            let guide = "";
            const assetName = seed || "Asset";

            if (lang === "es") {
                guide = `**GUÍA DE IMPLEMENTACIÓN ESTRATÉGICA (DUAL-AI: GEMINI + PERPLEXITY)**
                
### 1. Desglose Táctico: Ejecución de las Recomendaciones Clave

**A. Estrategia de Dominio en Eventos (Blitzscaling)**
*   **Investigación Perplexity**: El análisis de tráfico de eventos recientes sugiere que el 65% de los leads cualificados visitan el stand entre las 10:00 y las 12:00.
*   **Acción Gemini**: Programar los "Scientific Breakfasts" a las 09:00 AM, previo a la apertura general. Enviar invitaciones personalizadas (Outlook calendar invites) 3 semanas antes a una lista curada de R&D Directors.
*   **KPIs**: >40 asistentes VIP, >15 peticiones de muestras in-situ.

**B. Experiencia Sensorial (Tasting Bar)**
*   **Investigación Perplexity**: Tendencia creciente en "Functional Candies" y "Liquid Shots" en el sector Pharma.
*   **Acción Gemini**: Desarrollar prototipos de ${assetName} en formato Gummy (sabor frutos rojos para enmascarar notas herbales) y Vial bebible.
*   **Logística**: Partnering con co-manufacturer local para tener muestras frescas.

**C. Validación Externa (Awards)**
*   **Investigación Perplexity**: Los jueces de NutraIngredients valoran "Innovación Científica" y "Sostenibilidad Comercial".
*   **Acción Gemini**: Redactar el dossier de candidatura enfocando el 60% del texto en la tecnología Pure-Hydro Process® y el 40% en datos de mercado. Adjuntar Certificado EcoVadis Platinum como anexo obligatorio.

### 2. Asignación de Recursos Sugerida

*   **Equipo**: 1 Project Manager dedicado (Marketing), 1 Soporte Técnico (Científico) para el evento.
*   **Presupuesto Adicional**: Reservar 15% del presupuesto total para imprevistos de producción de muestras.

### 3. Mitigación de Riesgos (Risk Analysis)

*   **Riesgo**: Baja asistencia al desayuno científico.
*   **Mitigación**: Ofrecer contenido exclusivo "No publicado" y un incentivo de alto valor (ej. iPad raffle o consultoría gratuita).
*   **Riesgo**: Problemas de sabor en el prototipo.
*   **Mitigación**: Realizar focus group interno 1 mes antes. Tener versión "Placebo" para comparar textura si el sabor es muy complejo.`;
            } else if (lang === "ca") {
                guide = `**GUIA D'IMPLEMENTACIÓ ESTRATÈGICA (DUAL-AI: GEMINI + PERPLEXITY)**
                
### 1. Desglossament Tàctic: Execució de les Recomanacions Clau

**A. Estratègia de Domini en Esdeveniments (Blitzscaling)**
*   **Investigació Perplexity**: L'anàlisi de trànsit recent suggereix que el 65% dels leads qualificats visiten l'estand entre les 10:00 i les 12:00.
*   **Acció Gemini**: Programar els "Scientific Breakfasts" a les 09:00 AM. Enviar invitacions personalitzades 3 setmanes abans.
*   **KPIs**: >40 assistents VIP.

**B. Experiència Sensorial (Tasting Bar)**
*   **Investigació Perplexity**: Tendència creixent en "Functional Candies".
*   **Acció Gemini**: Desenvolupar prototips de ${assetName} en format Gummy i Vial bebible.

**C. Validació Externa (Awards)**
*   **Investigació Perplexity**: Els jutges valoren "Innovació Científica".
*   **Acció Gemini**: Redactar el dossier enfocant el 60% en Pure-Hydro Process®.

### 2. Assignació de Recursos Suggerida

*   **Equip**: 1 Project Manager, 1 Suport Tècnic.
*   **Pressupost**: Reservar 15% per imprevistos.`;
            } else {
                guide = `**STRATEGIC IMPLEMENTATION GUIDE (DUAL-AI: GEMINI + PERPLEXITY)**
                
### 1. Tactical Breakdown: Key Recommendation Execution

**A. Event Dominance Strategy (Blitzscaling)**
*   **Perplexity Research**: Traffic analysis suggests 65% of qualified leads visit booths between 10:00 and 12:00.
*   **Gemini Action**: Schedule "Scientific Breakfasts" at 09:00 AM. Send personalized invites 3 weeks prior.
*   **KPIs**: >40 VIP attendees.

**B. Sensory Experience (Tasting Bar)**
*   **Perplexity Research**: Growing trend in "Functional Candies".
*   **Gemini Action**: Develop ${assetName} prototypes in Gummy and Drinkable Vial formats.

**C. External Validation (Awards)**
*   **Perplexity Research**: Judges value "Scientific Innovation".
*   **Gemini Action**: Draft submission focusing 60% on Pure-Hydro Process®.

### 2. Resource Allocation

*   **Team**: 1 Project Manager, 1 Technical Support.
*   **Budget**: Reserve 15% for contingencies.`;
            }

            setDeepDiveResult(guide);
            setDeepDiveLoading(false);
        }, 2500); // Longer delay for "Deep Dive" effect
    };

    const handleExport = () => {
        const content = `
EUROMED INTELPLANNER - STRATEGIC REPORT
=======================================
Date: ${new Date().toLocaleDateString()}
Asset: ${seed}
Market: ${market}
Budget: €${budget}
Campaign Type: ${campaignType === 'impact' ? t('impactCampaign') : t('brandMaintenance')}

${t("missionCritical")}
---------------------------------------
${result?.missionCritical}

${t("keyRecommendations")}
---------------------------------------
${result?.recommendations.map(r => `[${r.title}]\n${r.description}`).join('\n\n')}

${deepDiveResult ? `
${t("implementationGuide")}
---------------------------------------
${deepDiveResult}
` : ''}

=======================================
Generated by Gravity Engine (Mock)
`;
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Strategy_Report_${seed}_${market}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.iconWrapper}>
                    <Target size={40} />
                </div>
                <div>
                    <h1 className={styles.title}>{t("strategicPlanning")}</h1>
                    <p className={styles.subtitle}>{t("strategySubtitle")}</p>
                </div>
            </header>

            <div className={styles.grid}>
                <section className={`${styles.panel} glass-panel`}>
                    <h2 className={styles.panelTitle}>{t("inputParameters")}</h2>
                    <form onSubmit={handleGenerate} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="asset" className={styles.label}>{t("strategicAsset")}</label>
                            <input
                                type="text"
                                id="asset"
                                className={styles.input}
                                placeholder="e.g. Pomanox, Citrus Extract"
                                value={seed}
                                readOnly
                                disabled
                                style={{ opacity: 0.7, cursor: 'not-allowed' }}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="campaignType" className={styles.label}>{t("campaignType")}</label>
                            <select
                                id="campaignType"
                                className={styles.input}
                                value={campaignType}
                                onChange={(e) => setCampaignType(e.target.value)}
                            >
                                <option value="impact">{t("impactCampaign")}</option>
                                <option value="maintenance">{t("brandMaintenance")}</option>
                            </select>
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="market" className={styles.label}>{t("targetMarket")}</label>
                            <input
                                type="text"
                                id="market"
                                className={styles.input}
                                placeholder="e.g. USA, Germany, China"
                                value={market}
                                onChange={(e) => setMarket(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="budget" className={styles.label}>{t("budgetAllocation")}</label>
                            <input
                                type="number"
                                id="budget"
                                className={styles.input}
                                placeholder="Min 5000"
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                                required
                            />
                        </div>

                        {error && (
                            <div className={styles.errorBox}>
                                <AlertCircle size={20} className={styles.errorIcon} />
                                <p>{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            className={`glass-button ${styles.submitBtn}`}
                            disabled={loading}
                        >
                            {loading ? <span className={styles.generating}><Sparkles size={18} className={styles.spin} /> {t("generating")}</span> : t("generateStrategy")}
                        </button>
                    </form>

                </section>

                <section className={`${styles.panel} ${styles.resultsPanel} glass-panel`}>
                    {result ? (
                        <div className={styles.resultsContent}>
                            <div className={styles.missionBox}>
                                <h3 className={styles.missionTitle}>{t("missionCritical")}</h3>
                                <p className={styles.missionText}>{result.missionCritical}</p>
                            </div>

                            <div className={styles.recommendations}>
                                <h3 className={styles.recTitle}>{t("keyRecommendations")}</h3>
                                <div className={styles.recGrid}>
                                    {result.recommendations.map((rec, idx) => (
                                        <div key={idx} className={styles.recCard}>
                                            <div className={styles.recHeader}>
                                                <CheckCircle size={20} className={styles.checkIcon} />
                                                <h4>{rec.title}</h4>
                                            </div>
                                            <p>{rec.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* DEEP DIVE SECTION */}
                            {!deepDiveResult ? (
                                <button
                                    onClick={handleDeepDive}
                                    className={`glass-button ${styles.deepDiveBtn}`}
                                    disabled={deepDiveLoading}
                                    style={{ marginTop: '1.5rem', width: '100%', background: 'rgba(55, 124, 188, 0.2)', border: '1px solid rgba(55, 124, 188, 0.5)' }}
                                >
                                    {deepDiveLoading ? (
                                        <span className={styles.generating}>
                                            <Sparkles size={18} className={styles.spin} /> {t("processingDual")}
                                        </span>
                                    ) : (
                                        <>
                                            <Zap size={18} style={{ marginRight: '8px' }} /> {t("expandInfo")}
                                        </>
                                    )}
                                </button>
                            ) : (
                                <div className={styles.deepDiveResult} style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', borderLeft: '3px solid var(--primary-green)' }}>
                                    <h3 style={{ color: 'var(--primary-green)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Sparkles size={18} /> {t("deepDiveTitle")}
                                    </h3>
                                    <div style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>
                                        <div dangerouslySetInnerHTML={{
                                            __html: deepDiveResult
                                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                                .replace(/### (.*?)\n/g, '<h4 style="color:white; margin-top:1rem; margin-bottom:0.5rem; font-size:1.1rem;">$1</h4>')
                                                .replace(/\* (.*?)\n/g, '<li style="margin-left:1rem; margin-bottom:0.3rem;">$1</li>')
                                        }} />
                                    </div>
                                </div>
                            )}

                            <button onClick={handleExport} className={styles.exportBtn}>
                                {t("downloadReport")}
                            </button>
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <Target size={48} className={styles.emptyIcon} />
                            <p>{t("strategySubtitle")}</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
