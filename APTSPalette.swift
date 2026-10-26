import Foundation

public enum APTSPalette {
    public enum PaletteError: Error { case invalidHex, unknownToken }
    public static let steps = [50,100,200,300,400,500,600,700,800,900]
    private static let weights = [48698,77660,156851,277217,617325,1000000,815154,675198,498326,319742]
    private static let neutral: [Int: String] = [
        50: "#F9FAFB",
        100: "#F3F4F6",
        200: "#E5E7EB",
        300: "#D0D5DC",
        400: "#9CA3B0",
        500: "#6B7280",
        600: "#4B5563",
        700: "#384252",
        800: "#1F2937",
        900: "#111827"
    ]
    private static let ramps: [String: String] = [
        "mb-secondary": "#965DF5",
        "mb-link": "#5FB9F2",
        "mb-warning": "#F9A207",
        "mb-correct": "#21C45D",
        "mb-wrong": "#EF4343",
        "mb-not-started": "#F9A207"
    ]
    public static func generate(name: String) throws -> [Int: String] {
        if name == "mb-neutral" { return neutral }
        guard let ramp = ramps[name] else { throw PaletteError.unknownToken }
        return try generate(hex: ramp)
    }
    public static func generate(hex: String) throws -> [Int: String] {
        guard hex.count == 7, hex.range(of: "^#[0-9A-Fa-f]{6}$", options: .regularExpression) != nil,
              let value = UInt32(hex.dropFirst(), radix: 16) else { throw PaletteError.invalidHex }
        let channels = [Int((value >> 16) & 255), Int((value >> 8) & 255), Int(value & 255)]
        var result: [Int: String] = [:]
        for (i, step) in steps.enumerated() {
            let k = weights[i], target = step < 500 ? 255 : 0
            let rgb = channels.map { channel in
                (target * (1_000_000 - k) + channel * k + 500_000) / 1_000_000
            }
            result[step] = String(format: "#%02X%02X%02X", rgb[0], rgb[1], rgb[2])
        }
        return result
    }
}
