package io.github.willqi.chatreport.plugin;

import io.github.willqi.chatreport.plugin.commands.ChatReportCommand;
import io.github.willqi.chatreport.plugin.webapi.WebAPI;
import org.bukkit.plugin.java.JavaPlugin;

public class ChatReportPlugin extends JavaPlugin {

    private WebAPI webAPI;
    private PunishmentManager punishmentManager;
    private RedisThread redisThread;


    @Override
    public void onEnable() {
        this.saveDefaultConfig();

        this.webAPI = new WebAPI(
                this.getConfig().getString("website-base-url"),
                this.getConfig().getString("website-secret")
        );
        this.punishmentManager = new PunishmentManager(this);
        this.redisThread = new RedisThread(this);
        this.redisThread.start();

        this.getCommand("chatreport").setExecutor(new ChatReportCommand(this));
    }

    @Override
    public void onDisable() {
        this.redisThread.interrupt();
    }

    public WebAPI getWebAPI() {
        return this.webAPI;
    }

    public PunishmentManager getPunishmentManager() {
        return this.punishmentManager;
    }

}
