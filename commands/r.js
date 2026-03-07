const { PermissionsBitField } = require("discord.js");

module.exports = {
    name: "r",
    description: "Sistema de roles",

    async execute(message, args) {
        if (!message.guild) return;

        // Permisos usuario
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            return message.reply("❌ No tienes permiso para gestionar roles.");
        }

        // Permisos bot
        if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            return message.reply("❌ No tengo permisos para gestionar roles.");
        }

        if (!args[0]) {
            return message.reply(
                "❌ Usa:\n`.r create Nombre`\n`.r delete Nombre`\n`.r @usuario NombreDelRol`"
            );
        }

        const subCommand = args[0].toLowerCase();

        // =========================
        // CREAR ROL
        // =========================
        if (subCommand === "create") {

            const roleName = args.slice(1).join(" ");
            if (!roleName) return message.reply("❌ Escribe el nombre del rol.");

            const existingRole = message.guild.roles.cache.find(
                r => r.name.toLowerCase() === roleName.toLowerCase()
            );

            if (existingRole) return message.reply("❌ Ese rol ya existe.");

            try {
                const newRole = await message.guild.roles.create({
                    name: roleName,
                    reason: `Rol creado por ${message.author.tag}`
                });

                return message.reply(`✅ Rol creado correctamente: ${newRole}`);
            } catch (error) {
                console.error(error);
                return message.reply("❌ Error al crear el rol.");
            }
        }

        // =========================
        // ELIMINAR ROL
        // =========================
        if (subCommand === "delete") {

            const roleName = args.slice(1).join(" ");
            if (!roleName) return message.reply("❌ Escribe el nombre del rol.");

            const role = message.guild.roles.cache.find(
                r => r.name.toLowerCase() === roleName.toLowerCase()
            );

            if (!role) return message.reply("❌ Ese rol no existe.");

            // Verificar jerarquía
            if (role.position >= message.guild.members.me.roles.highest.position) {
                return message.reply("❌ Ese rol está por encima de mi jerarquía.");
            }

            try {
                await role.delete(`Rol eliminado por ${message.author.tag}`);
                return message.reply("✅ Rol eliminado correctamente.");
            } catch (error) {
                console.error(error);
                return message.reply("❌ No pude eliminar ese rol.");
            }
        }

        // =========================
        // TOGGLE ROL A USUARIO
        // =========================

        const member =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0]);

        if (!member) {
            return message.reply("❌ Debes mencionar a un usuario.");
        }

        const roleName = args.slice(1).join(" ");
        if (!roleName) {
            return message.reply("❌ Debes escribir el nombre del rol.");
        }

        const role = message.guild.roles.cache.find(
            r => r.name.toLowerCase() === roleName.toLowerCase()
        );

        if (!role) return message.reply("❌ Ese rol no existe.");

        // Verificar jerarquía del bot
        if (role.position >= message.guild.members.me.roles.highest.position) {
            return message.reply("❌ Ese rol está por encima de mi jerarquía.");
        }

        try {

            // 🔁 TOGGLE
            if (member.roles.cache.has(role.id)) {
                await member.roles.remove(role);
                return message.reply(`➖ Rol ${role.name} removido de ${member.user.tag}`);
            } else {
                await member.roles.add(role);
                return message.reply(`➕ Rol ${role.name} asignado a ${member.user.tag}`);
            }

        } catch (error) {
            console.error(error);
            return message.reply("❌ No pude modificar ese rol.");
        }
    }
};