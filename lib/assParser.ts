// lib/assParser.ts
// This is a simplified placeholder. A real ASS parser is complex.

export interface AssStyle {
    Name: string;
    Fontname: string;
    Fontsize: number;
    PrimaryColour: string; // ABGR format in ASS, might need conversion to RGBA/Hex
    SecondaryColour: string;
    OutlineColour: string;
    BackColour: string;
    Bold: boolean;
    Italic: boolean;
    Underline: boolean;
    StrikeOut: boolean;
    ScaleX: number;
    ScaleY: number;
    Spacing: number;
    Angle: number;
    BorderStyle: number; // 1=Outline+Shadow, 3=OpaqueBox
    Outline: number;
    Shadow: number;
    Alignment: number; // 1-9 for keypad positions
    MarginL: number;
    MarginR: number;
    MarginV: number;
    Encoding: number;
}

export interface AssDialogue {
    Layer: number;
    Start: string; // "0:00:00.00"
    End: string;   // "0:00:00.00"
    Style: string; // Name of style
    Name: string;
    MarginL: number;
    MarginR: number;
    MarginV: number;
    Effect: string;
    Text: string;
    // Parsed convenience properties
    startTimeSeconds: number;
    endTimeSeconds: number;
    rawText: string; // Text without ASS override codes
    parsedTextSegments: any[]; // For rich text, if you implement
}

export interface ParsedAss {
    info: Record<string, string>;
    styles: AssStyle[];
    dialogues: AssDialogue[];
}

// Helper to convert ASS time format (H:MM:SS.CC) to seconds
function assTimeToSeconds(timeStr: string): number {
    const parts = timeStr.split(':');
    if (parts.length !== 3) return 0;
    const [h, m, s_cc] = parts;
    const [s, cc] = s_cc.split('.');
    return (
        parseInt(h) * 3600 +
        parseInt(m) * 60 +
        parseInt(s) +
        parseInt(cc || '0') / 100
    );
}

// Helper to convert ASS ABGR color to RGBA/Hex (very simplified)
// ASS colors are &HBBGGRR& or &HAABBGGRR& (alpha, blue, green, red)
// This conversion is approximate and may need more robust handling.
function assColorToHex(assColor: string): string {
    if (!assColor.startsWith('&H')) {
        return '#FFFFFF'; // Default white if format is unexpected
    }
    let hex = assColor.replace('&H', '').replace('&', '').toUpperCase();
    // Assume BBGGRR format for simplicity, ignoring alpha for now
    if (hex.length === 6) { // BBGGRR
        const b = hex.substring(0, 2);
        const g = hex.substring(2, 4);
        const r = hex.substring(4, 6);
        return `#${r}${g}${b}`;
    } else if (hex.length === 8) { // AABBGGRR
        const a = hex.substring(0, 2); // Alpha, could use for opacity
        const b = hex.substring(2, 4);
        const g = hex.substring(4, 6);
        const r = hex.substring(6, 8);
        // You might convert alpha to CSS rgba format
        return `#${r}${g}${b}`; // Still returning hex, consider rgba if alpha needed
    }
    return '#FFFFFF'; // Default
}

export function parseAss(assContent: string): ParsedAss {
    const lines = assContent.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    const parsed: ParsedAss = {
        info: {},
        styles: [],
        dialogues: [],
    };

    let currentSection: 'info' | 'styles' | 'events' | null = null;
    let styleFormat: string[] = [];
    let eventFormat: string[] = [];

    for (const line of lines) {
        if (line.startsWith('[Script Info]')) {
            currentSection = 'info';
            continue;
        } else if (line.startsWith('[V4+ Styles]')) {
            currentSection = 'styles';
            continue;
        } else if (line.startsWith('[Events]')) {
            currentSection = 'events';
            continue;
        } else if (line.startsWith('[')) { // New section
            currentSection = null; // Ignore unknown sections for this parser
            continue;
        }

        if (currentSection === 'info') {
            const parts = line.split(':');
            if (parts.length >= 2) {
                parsed.info[parts[0].trim()] = parts.slice(1).join(':').trim();
            }
        } else if (currentSection === 'styles') {
            if (line.startsWith('Format:')) {
                styleFormat = line.substring('Format:'.length).split(',').map(s => s.trim());
            } else if (line.startsWith('Style:')) {
                const values = line.substring('Style:'.length).split(',').map(v => v.trim());
                const style: Partial<AssStyle> = {};
                styleFormat.forEach((key, index) => {
                    const val = values[index];
                    if (key === 'PrimaryColour' || key === 'SecondaryColour' || key === 'OutlineColour' || key === 'BackColour') {
                        (style as any)[key] = assColorToHex(val); // Convert ASS color to hex
                    } else if (['Fontsize', 'ScaleX', 'ScaleY', 'Spacing', 'Angle', 'Outline', 'Shadow', 'Alignment', 'MarginL', 'MarginR', 'MarginV', 'Encoding'].includes(key)) {
                        (style as any)[key] = parseFloat(val);
                    } else if (['Bold', 'Italic', 'Underline', 'StrikeOut'].includes(key)) {
                        (style as any)[key] = parseInt(val) === -1;
                    } else {
                        (style as any)[key] = val;
                    }
                });
                parsed.styles.push(style as AssStyle);
            }
        } else if (currentSection === 'events') {
            if (line.startsWith('Format:')) {
                eventFormat = line.substring('Format:'.length).split(',').map(s => s.trim());
            } else if (line.startsWith('Dialogue:')) {
                const values = line.substring('Dialogue:'.length).split(',');
                const dialogue: Partial<AssDialogue> = {};
                eventFormat.forEach((key, index) => {
                    if (key === 'Text') {
                        // Re-join the rest of the values as Text can contain commas
                        (dialogue as any)[key] = values.slice(index).join(',').trim();
                    } else {
                        (dialogue as any)[key] = values[index].trim();
                    }
                });

                // Add convenience properties
                const fullText = dialogue.Text || '';
                dialogue.rawText = fullText.replace(/\{[^}]*\}/g, ''); // Remove ASS override codes
                dialogue.startTimeSeconds = assTimeToSeconds(dialogue.Start || '0:00:00.00');
                dialogue.endTimeSeconds = assTimeToSeconds(dialogue.End || '0:00:00.00');

                parsed.dialogues.push(dialogue as AssDialogue);
            }
        }
    }

    // Assign a unique ID to each dialogue for React keys
    parsed.dialogues = parsed.dialogues.map((d, i) => ({ ...d, id: `dialogue-${i}` }));

    return parsed;
}