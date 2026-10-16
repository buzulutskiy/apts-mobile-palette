import java.util.Locale

object AptsPalette {
    private val steps = listOf(50,100,200,300,400,500,600,700,800,900)
    private val profiles = mapOf(
        "brand" to listOf(48730, 97728, 246996, 400867, 696861, 1000000, 901650, 751749, 600204, 491127),
        "standard" to listOf(48698, 77660, 156851, 277217, 617325, 1000000, 815154, 675198, 498326, 319742)
    )
    private val neutral = mapOf(
        50 to "#F9FAFB",
        100 to "#F3F4F6",
        200 to "#E5E7EB",
        300 to "#D0D5DC",
        400 to "#9CA3B0",
        500 to "#6B7280",
        600 to "#4B5563",
        700 to "#384252",
        800 to "#1F2937",
        900 to "#111827"
    )
    private val ramps = mapOf(
        "mb-secondary" to ("#965DF5" to "brand"),
        "mb-link" to ("#5FB9F2" to "standard"),
        "mb-warning" to ("#F9A207" to "standard"),
        "mb-correct" to ("#21C45D" to "standard"),
        "mb-wrong" to ("#EF4343" to "standard"),
        "mb-not-started" to ("#F9A207" to "standard")
    )
    fun generate(name: String): Map<Int, String> {
        if (name == "mb-neutral") return neutral.toMap()
        val ramp = requireNotNull(ramps[name]) { "Unknown ramp: $name" }
        return generate(ramp.first, ramp.second)
    }
    fun generate(hex: String, profile: String): Map<Int, String> {
        require(Regex("^#[0-9A-Fa-f]{6}$").matches(hex)) { "Expected #RRGGBB" }
        val weights = requireNotNull(profiles[profile]) { "Unknown profile: $profile" }
        val value = hex.substring(1).toInt(16)
        val channels = listOf((value shr 16) and 255, (value shr 8) and 255, value and 255)
        return steps.mapIndexed { i, step ->
            val k = weights[i]
            val target = if (step < 500) 255 else 0
            val rgb = channels.map { channel ->
                (target * (1_000_000 - k) + channel * k + 500_000) / 1_000_000
            }
            step to String.format(Locale.ROOT, "#%02X%02X%02X", rgb[0], rgb[1], rgb[2])
        }.toMap()
    }
}
