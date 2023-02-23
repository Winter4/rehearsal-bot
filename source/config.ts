type TelegramConfig = {
  botToken: string;
  adminChatId: string;
};
function getTelegramConfig(): TelegramConfig {
  const config: TelegramConfig = {
    botToken: process.env.TG_BOT_TOKEN ?? "",
    adminChatId: process.env.ADMIN_CHAT_ID ?? "",
  };

  if (!config.botToken) throw new Error("Empty TG bot token");
  if (!config.adminChatId) throw new Error("Empty admin chat ID");

  return config;
}

type DatabaseConfig = {
  url: string;
  logging: boolean;
};
function getDatabaseConfig(): DatabaseConfig {
  const config: DatabaseConfig = {
    url: process.env.DB_URL ?? "",
    logging: Boolean(Number(process.env.DB_LOGS)) ?? false,
  };

  if (!config.url) throw new Error("Empty DB URL");

  return config;
}

// - - - - - - - //

export type BotConfig = {
  telegram: TelegramConfig;
  database: DatabaseConfig;
};
export function getConfig(): BotConfig {
  return {
    telegram: getTelegramConfig(),
    database: getDatabaseConfig(),
  };
}
