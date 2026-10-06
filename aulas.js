const sqlite3 = require("sqlite3").verbose();

const banco = new sqlite3.Database("./banco.db");

const aulas = [

    // SEGUNDA
    ["segunda", "7h20", "Programação Back-end"],
    ["segunda", "8h10", "Programação Back-end"],
    ["segunda", "9h00", "Língua Portuguesa"],
    ["segunda", "10h05", "Sociologia"],
    ["segunda", "10h55", "Banco de Dados"],
    ["segunda", "11h45", "Língua Portuguesa"],

    // TERÇA
    ["terça", "7h20", "Física"],
    ["terça", "8h10", "Filosofia"],
    ["terça", "9h00", "Física"],
    ["terça", "10h05", "Sociologia"],
    ["terça", "10h55", "Banco de Dados"],
    ["terça", "11h45", "Banco de Dados"],

    // QUARTA
    ["quarta", "7h20", "Língua Portuguesa"],
    ["quarta", "8h10", "Língua Inglesa"],
    ["quarta", "9h00", "Educação Física"],
    ["quarta", "10h05", "Matemática"],
    ["quarta", "10h55", "Educação Física"],
    ["quarta", "11h45", "Educação Financeira"],

    // QUINTA
    ["quinta", "7h20", "Inovação Tecnológica e Empreendedorismo"],
    ["quinta", "8h10", "Filosofia"],
    ["quinta", "9h00", "Matemática"],
    ["quinta", "10h05", "Programação Front-end"],
    ["quinta", "10h55", "Língua Inglesa"],
    ["quinta", "11h45", "Programação Back-end"],

    // SEXTA
    ["sexta", "7h20", "Inovação Tecnológica e Empreendedorismo"],
    ["sexta", "8h10", "Inovação Tecnológica e Empreendedorismo"],
    ["sexta", "9h00", "História"],
    ["sexta", "10h05", "História"],
    ["sexta", "10h55", "Programação Front-end"],
    ["sexta", "11h45", "Programação Front-end"]
];

banco.serialize(() => {

    // Cria a tabela se ainda não existir
    banco.run(`
        CREATE TABLE IF NOT EXISTS aulas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            dia TEXT,
            horario TEXT,
            componente TEXT
        )
    `);

    // Limpa as aulas antigas, para não duplicar se rodar o script de novo
    banco.run("DELETE FROM aulas");
    banco.run("DELETE FROM sqlite_sequence WHERE name = 'aulas'");

    const comando = banco.prepare(
        "INSERT INTO aulas (dia, horario, componente) VALUES (?, ?, ?)"
    );

    aulas.forEach((aula) => {
        comando.run(aula);
    });

    // Só fecha o banco depois que todas as aulas foram inseridas
    comando.finalize(() => {
        console.log("Aulas cadastradas com sucesso!");
        banco.close();
    });
});