// Enum Types
enum SoilRockTypes {
    CLAY,
    SILT,
    SAND,
    GRAVEL,
    COBBLES,
    BOULDERS
}

enum SoilBehaviour {
    COHESIVE,
    GRANULAR
}

enum SecondaryConstituents {
    SANDY,
    GRAVELLY,
    CLAYEY,
    SILTY,
    COBBLY
}

enum AmountDefine {
    SLIGHTLY,
    NORMAL,
    VERY
}

enum CohesiveStrength {
    VERY_SOFT,
    SOFT,
    SOFT_TO_FIRM,
    FIRM,
    FIRM_TO_STIFF,
    STIFF,
    VERY_STIFF,
    HARD
}

enum GranularStrength {
    VERY_LOOSE,
    LOOSE,
    MEDIUM_DENSE,
    DENSE,
    VERY_DENSE
}

interface Strength {
    StrengthType: number;
    Cohesive?: CohesiveStrength;
    Granular?: GranularStrength;
}

interface Constituent {
    Constituent: SecondaryConstituents;
    Amount?: AmountDefine;
}

interface SoilDescription {
    SoilBehaviour?: SoilBehaviour;
    PrimaryConstituent?: SoilRockTypes[];
    SecondaryConstituents?: Constituent[];
    StrengthDescriptor?: Strength | null;
    RawDescription: string;
}

const soilRockTypes = ["clay", "silt", "sand", "gravel", "cobbles", "boulders"];
const cohStrengthDesc = ["very soft", "soft to firm", "soft", "firm to stiff", "firm", "very stiff", "stiff", "hard"];
const granStrengthDesc = ["medium dense", "very dense", "dense", "very loose", "loose"];
const soilCons = ["clayey", "silty", "sandy", "gravelly", "cobbly"];
const amounts = ["very", "slightly"];

export function SoilDescriptionProcessor(bs5930desc: string): SoilDescription {
    const stype = GetSoilType(bs5930desc);
    const cons = getSecondarySoilType(bs5930desc);
    const sBeh = mapSoilBehavHelper(stype);
    return {
        SoilBehaviour: sBeh[0],
        PrimaryConstituent: stype,
        SecondaryConstituents: cons,
        StrengthDescriptor: strengthDescHelper(bs5930desc),
        RawDescription: bs5930desc
    };
}

function strengthDescHelper(bs5930: string): Strength | null {
    const behav = mapSoilBehavHelper(GetSoilType(bs5930))[0];
    switch (behav) {
        case SoilBehaviour.GRANULAR:
            return granMap(findFirstMatch(bs5930, granStrengthDesc));
        case SoilBehaviour.COHESIVE:
            return cohesiveMap(findFirstMatch(bs5930, cohStrengthDesc));
    }
}

function cohesiveMap(strength: string | null): Strength | null {
    if (strength === null) {
        return null;
    }
    let cohStrength: CohesiveStrength;
    switch (strength) {
        case "soft to firm":
            cohStrength = CohesiveStrength.SOFT_TO_FIRM;
            break;
        case "very soft":
            cohStrength = CohesiveStrength.VERY_SOFT;
            break;
        case "soft":
            cohStrength = CohesiveStrength.SOFT;
            break;
        case "firm to stiff":
            cohStrength = CohesiveStrength.FIRM_TO_STIFF;
            break;
        case "firm":
            cohStrength = CohesiveStrength.FIRM;
            break;
        case "very stiff":
            cohStrength = CohesiveStrength.VERY_STIFF;
            break;
        case "stiff":
            cohStrength = CohesiveStrength.STIFF;
            break;
        case "hard":
            cohStrength = CohesiveStrength.HARD;
            break;
        default:
            return null;
    }
    return { StrengthType: SoilBehaviour.COHESIVE, Cohesive: cohStrength };
}

function granMap(strength: string | null): Strength | null {
    if (strength === null) {
        return null;
    }
    let granStrength: GranularStrength;
    switch (strength) {
        case "medium dense":
            granStrength = GranularStrength.MEDIUM_DENSE;
            break;
        case "very dense":
            granStrength = GranularStrength.VERY_DENSE;
            break;
        case "dense":
            granStrength = GranularStrength.DENSE;
            break;
        case "loose":
            granStrength = GranularStrength.LOOSE;
            break;
        case "very loose":
            granStrength = GranularStrength.VERY_LOOSE;
            break;
        default:
            return null;
    }
    return { StrengthType: SoilBehaviour.GRANULAR, Granular: granStrength };
}

function soilConsHelper(cons: string, bs5930: string): Constituent {
    let secondaryConstituent: SecondaryConstituents;
    switch (cons) {
        case "clayey":
            secondaryConstituent = SecondaryConstituents.CLAYEY;
            break;
        case "sandy":
            secondaryConstituent = SecondaryConstituents.SANDY;
            break;
        case "silty":
            secondaryConstituent = SecondaryConstituents.SILTY;
            break;
        case "gravelly":
            secondaryConstituent = SecondaryConstituents.GRAVELLY;
            break;
        case "cobbly":
            secondaryConstituent = SecondaryConstituents.COBBLY;
            break;
        default:
            throw new Error("Invalid constituent");
    }
    const amount = amountHelper(bs5930, cons);
    return { Constituent: secondaryConstituent, Amount: amount };
}

function amountHelper(bs5930: string, cons: string): AmountDefine | undefined {
    const vals = [`very ${cons}`, `slightly ${cons}`, cons];
    const match = findFirstMatch(bs5930, vals);
    if (match === null) {
        return undefined;
    }
    if (match.includes("very")) {
        return AmountDefine.VERY;
    } else if (match.includes("slightly")) {
        return AmountDefine.SLIGHTLY;
    } else {
        return undefined;
    }
}

function findFirstMatch(item: string, patterns: string[]): string | null {
    for (const pattern of patterns) {
        if (item.toLowerCase().includes(pattern.toLowerCase())) {
            return pattern;
        }
    }
    return null;
}

function GetSoilType(bs5930Description: string): SoilRockTypes[] {
    const matches = soilRockTypes.filter(soilType => {
        const regex = new RegExp(`\\b${soilType}\\b`, 'i');
        return regex.test(bs5930Description);
    });
    if (matches.length === 0) {
        throw new Error("Not a Soil!");
    }
    return matches.map(match => soildescHelper(match));
}

function getSecondarySoilType(bs5930Description: string): Constituent[] {
    const matches = soilCons.filter(consType => bs5930Description.toUpperCase().includes(consType.toUpperCase()));
    if (matches.length === 0) {
        throw new Error("Not a Soil!");
    }
    return matches.map(match => soilConsHelper(match, bs5930Description));
}

function soildescHelper(cons: string): SoilRockTypes {
    switch (cons) {
        case "clay":
            return SoilRockTypes.CLAY;
        case "silt":
            return SoilRockTypes.SILT;
        case "sand":
            return SoilRockTypes.SAND;
        case "gravel":
            return SoilRockTypes.GRAVEL;
        case "cobbles":
            return SoilRockTypes.COBBLES;
        case "boulders":
            return SoilRockTypes.BOULDERS;
        default:
            throw new Error("Invalid soil type");
    }
}

function mapSoilBehavHelper(cons: SoilRockTypes[]): SoilBehaviour[] {
    return cons.map(con => {
        switch (con) {
            case SoilRockTypes.CLAY:
            case SoilRockTypes.SILT:
                return SoilBehaviour.COHESIVE;
            case SoilRockTypes.SAND:
            case SoilRockTypes.GRAVEL:
            case SoilRockTypes.COBBLES:
            case SoilRockTypes.BOULDERS:
                return SoilBehaviour.GRANULAR;
            default:
                throw new Error("Invalid soil type");
        }
    });
}

function soilDescriptionToCu(desc: CohesiveStrength): [number, number] {
    switch (desc) {
        case CohesiveStrength.VERY_SOFT:
            return [0.0, 20.0];
        case CohesiveStrength.SOFT:
            return [20.0, 40.0];
        case CohesiveStrength.SOFT_TO_FIRM:
            return [40.0, 50.0];
        case CohesiveStrength.FIRM:
            return [40.0, 75.0];
        case CohesiveStrength.FIRM_TO_STIFF:
            return [75.0, 100.0];
        case CohesiveStrength.STIFF:
            return [75.0, 150.0];
        case CohesiveStrength.VERY_STIFF:
            return [150.0, 250.0];
        case CohesiveStrength.HARD:
            return [150.0, 500.0];
        default:
            return [0.0, 0.0];
    }
}

if (require.main === module) {
    const testDescription = "very soft slightly sandy gravelly clay";
    const processedDescription = SoilDescriptionProcessor(testDescription);
        console.log(JSON.stringify(convertEnumsToStrings(processedDescription), null, 2));
    
    function convertEnumsToStrings(description: SoilDescription): any {
        return {
            ...description,
            SoilBehaviour: description.SoilBehaviour !== undefined ? SoilBehaviour[description.SoilBehaviour] : undefined,
            PrimaryConstituent: description.PrimaryConstituent?.map(type => SoilRockTypes[type]),
            SecondaryConstituents: description.SecondaryConstituents?.map(cons => ({
                ...cons,
                Constituent: SecondaryConstituents[cons.Constituent],
                Amount: cons.Amount !== undefined ? AmountDefine[cons.Amount] : undefined
            })),
            StrengthDescriptor: description.StrengthDescriptor ? {
                ...description.StrengthDescriptor,
                Cohesive: description.StrengthDescriptor.Cohesive !== undefined ? CohesiveStrength[description.StrengthDescriptor.Cohesive] : undefined,
                Granular: description.StrengthDescriptor.Granular !== undefined ? GranularStrength[description.StrengthDescriptor.Granular] : undefined
            } : null
        };
    }
}