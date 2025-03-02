import { NextResponse } from "next/server";

// Generate random number between min and max
const randomBetween = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Generate base stats for NFT (range 5-20)
const generateBaseStats = () => {
  return {
    strength: randomBetween(5, 20),
    agility: randomBetween(5, 20),
    intelligence: randomBetween(5, 20),
    charisma: randomBetween(5, 20),
    vitality: randomBetween(5, 20),
  };
};

// Calculate social boosts based on connected accounts
const calculateSocialBoosts = (connectedAccounts: string[]) => {
  const boosts = {
    strength: 0,
    agility: 0,
    intelligence: 0,
    charisma: 0,
    vitality: 0,
  };

  // Each social connection provides moderate boosts
  connectedAccounts.forEach(account => {
    switch (account) {
      case "twitter":
        boosts.charisma += 10; // +10 charisma
        boosts.intelligence += 5; // +5 intelligence
        break;
      case "github":
        boosts.intelligence += 12; // +12 intelligence
        boosts.strength += 5; // +5 strength
        break;
      case "discord":
        boosts.agility += 8; // +8 agility
        boosts.vitality += 8; // +8 vitality
        break;
      // Add more social platforms here
    }
  });

  return boosts;
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const connectedAccounts = searchParams.get("connectedAccounts")?.split(",") || [];

    // Generate base stats (5-20 range)
    const baseStats = generateBaseStats();

    // Calculate boosts from social connections
    const socialBoosts = calculateSocialBoosts(connectedAccounts);

    // Combine base stats with boosts (capped at 100)
    const finalStats = {
      strength: Math.min(100, baseStats.strength + socialBoosts.strength),
      agility: Math.min(100, baseStats.agility + socialBoosts.agility),
      intelligence: Math.min(100, baseStats.intelligence + socialBoosts.intelligence),
      charisma: Math.min(100, baseStats.charisma + socialBoosts.charisma),
      vitality: Math.min(100, baseStats.vitality + socialBoosts.vitality),
    };

    // Calculate power level based on stats (scale of 100)
    const powerLevel = Math.floor(
      (Object.values(finalStats).reduce((sum, stat) => sum + stat, 0) / 500) * 100, // 500 is max total (100 * 5 stats)
    );

    const response = {
      success: true,
      stats: {
        ...finalStats,
        powerLevel,
        baseStats,
        socialBoosts,
        connectedAccounts,
      },
    };

    console.log("Generated NFT stats:", JSON.stringify(response, null, 2));
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error generating NFT stats:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error generating NFT stats" },
      { status: 500 },
    );
  }
}
