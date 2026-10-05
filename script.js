const assistant = document.querySelector("#assistant");
const assistantBackground =
    document.querySelector("#assistantBackground");

const assistantFloating =
    document.querySelector("#assistantFloating");

const assistantClose =
    document.querySelector("#assistantClose");

const openAssistantMenu =
    document.querySelector("#openAssistantMenu");

const assistantMessages =
    document.querySelector("#assistantMessages");

const initialAssistantChildCount =
    assistantMessages
        ? assistantMessages.children.length
        : 0;

const assistantForm =
    document.querySelector("#assistantForm");

const assistantInput =
    document.querySelector("#assistantInput");

let lastAssistantTrigger = null;

if (assistant) {

    if (!assistant.hasAttribute("role")) {
        assistant.setAttribute(
            "role",
            "dialog"
        );
    }

    if (!assistant.hasAttribute("aria-modal")) {
        assistant.setAttribute(
            "aria-modal",
            "true"
        );
    }

    if (!assistant.hasAttribute("aria-hidden")) {
        assistant.setAttribute(
            "aria-hidden",
            "true"
        );
    }

    if (!assistant.hasAttribute("aria-label")) {
        assistant.setAttribute(
            "aria-label",
            "Assistente Virtual"
        );
    }

}



function openAssistant() {

    lastAssistantTrigger =
        document.activeElement;

    if (assistant) {
        assistant.classList.add("open");
        assistant.setAttribute(
            "aria-hidden",
            "false"
        );
    }

    if (assistantBackground) {
        assistantBackground.classList.add("open");
    }

    if (assistantClose) {
        assistantClose.focus();
    }

}


function closeAssistant(event) {

    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }


    /* FECHA PRIMEIRO */

    if (assistant) {
        assistant.classList.remove("open");
        assistant.setAttribute(
            "aria-hidden",
            "true"
        );
    }

    if (assistantBackground) {
        assistantBackground.classList.remove("open");
    }




    /* REINICIA O FLUXO DO PROJETO */

    if (assistantFilterEnabled) {
        assistantConversationVersion += 1;

        assistantAwaitingAdvanceConfirmation = false;
        assistantWhatsAppUnlocked = false;
        assistantMembershipChoice = "";
        assistantClarifiedTopics.clear();
        assistantPendingClarification = [];
    }

    if (assistantFilterEnabled) {

        if (
            typeof projectQualificationStep !== "undefined"
        ) {
            projectQualificationStep = 0;
        }


        if (
            typeof projectQualificationData !== "undefined"
        ) {

            projectQualificationData.interest = "";
            projectQualificationData.time = "";
            projectQualificationData.communication = "";

        }


        if (
            typeof assistantOptions !== "undefined" &&
            assistantOptions
        ) {

            assistantOptions.classList.remove(
                "qualification-hidden"
            );

        }


        if (
            assistantMessages &&
            typeof initialAssistantChildCount !== "undefined"
        ) {

            while (
                assistantMessages.children.length >
                initialAssistantChildCount
            ) {

                assistantMessages.removeChild(
                    assistantMessages.lastElementChild
                );

            }

            assistantMessages.scrollTop = 0;

        }

    }

    if (
        lastAssistantTrigger === openAssistantMenu &&
        sidebar &&
        !sidebar.classList.contains("open") &&
        mobileMenuButton &&
        mobileMenuButton.getClientRects().length > 0
    ) {

        mobileMenuButton.focus();

    } else if (
        lastAssistantTrigger &&
        typeof lastAssistantTrigger.focus === "function"
    ) {

        lastAssistantTrigger.focus();

    }

}

if (assistantClose) {

    assistantClose.addEventListener(
        "click",
        event => {

            closeAssistant(event);

        }
    );

}

/* ==========================================
   ABRIR E FECHAR ASSISTENTE
========================================== */

if (assistantFloating) {

    assistantFloating.addEventListener(
        "click",
        openAssistant
    );

}

if (openAssistantMenu) {

    openAssistantMenu.addEventListener(
        "click",
        openAssistant
    );

}

if (assistantBackground) {

    assistantBackground.addEventListener(
        "click",
        closeAssistant
    );

}

document.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Escape") return;

        if (
            assistant &&
            assistant.classList.contains("open")
        ) {

            closeAssistant(event);
            return;

        }

        if (
            sidebar &&
            sidebar.classList.contains("open") &&
            mobileMenuButton
        ) {

            sidebar.classList.remove("open");

            mobileMenuButton.setAttribute(
                "aria-expanded",
                "false"
            );

            mobileMenuButton.setAttribute(
                "aria-label",
                "Abrir menu"
            );

            mobileMenuButton.focus();

        }

    }
);

if (assistant) {

    assistant.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Tab") return;

            const focusableElements =
                Array.from(
                    assistant.querySelectorAll(
                        'button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
                    )
                ).filter(
                    element =>
                        element.getClientRects().length > 0
                );

            if (!focusableElements.length) return;

            const firstElement =
                focusableElements[0];

            const lastElement =
                focusableElements[
                focusableElements.length - 1
                ];

            if (
                event.shiftKey &&
                document.activeElement === firstElement
            ) {

                event.preventDefault();
                lastElement.focus();

            } else if (
                !event.shiftKey &&
                document.activeElement === lastElement
            ) {

                event.preventDefault();
                firstElement.focus();

            }

        }
    );

}


function addMessage(text, type) {

    if (!assistantMessages) return;

    const message =
        document.createElement("div");

    message.classList.add(
        "message",
        type
    );

    message.textContent = text;

    if (type === "bot" && text.includes("\n")) {
        message.style.whiteSpace = "pre-line";
    }
    assistantMessages.appendChild(message);

    assistantMessages.scrollTop =
        assistantMessages.scrollHeight;

}



const answers = {

    membershipCancellation:
        "Cancelar a adesão ao clube é diferente de cancelar uma reserva. Para cancelar a sua adesão como Membro ou Sócio Membro, consulte as condições oficiais aplicáveis à sua conta e utilize os canais de apoio indicados na plataforma. Confirme o procedimento, os prazos e o efeito sobre pagamentos recorrentes, benefícios e reservas existentes. Este assistente não consegue cancelar a adesão nem confirmar se existe direito a reembolso.",

    projectTasks:
        "As tarefas da atividade como Sócio Membro podem incluir aprender como funciona o clube, conhecer as condições oficiais, apresentar o conceito a pessoas interessadas e acompanhar as suas dúvidas. Também envolve organizar contactos, utilizar as ferramentas disponíveis e desenvolver a comunicação. Avalie se estas tarefas se adaptam à sua rotina e aos seus interesses. Realizá-las não garante comissões ou resultados.",

    projectEvaluate:
        "Para avaliar se faz sentido ser Sócio Membro, considere os seus objetivos, o tempo disponível e a sua disposição para aprender, apresentar o clube e acompanhar pessoas interessadas. Analise os custos e os requisitos da atividade, sem contar com comissões garantidas ou com um prazo definido para obter resultados. Se procura apenas benefícios para viajar, pode explorar a opção de Membro. O que mais pesa na sua decisão: o tempo, os custos ou as tarefas da atividade?",

    travelMemberBenefits:
        "Como Membro, pode explorar os benefícios do clube para planejar viagens em cruzeiros, hotéis e resorts, sem desenvolver a atividade do projeto. Para entender se a adesão faz sentido pra você, considere a frequência com que pretende viajar, as experiências que procura e como poderá utilizar os benefícios. Compare os custos de adesão e os pagamentos recorrentes com as vantagens aplicáveis às reservas que pretende fazer. Consulte na plataforma os benefícios e as condições atuais da opção que escolher.",

    travelBenefits:
        "Para perceber como pode utilizar os seus benefícios, consulte na plataforma as condições da sua opção de Membro e da reserva que pretende fazer. Antes de confirmar, verifique quais benefícios podem ser aplicados, que limites existem e que montante terá de pagar. Não assuma que os benefícios cobrem todas as despesas da viagem. Confirme sempre as informações atuais na plataforma.",

    travelCancellation:
        "Antes de cancelar uma reserva, consulte as condições de cancelamento dessa reserva e confirme os prazos, eventuais encargos e se existe possibilidade de reembolso. Não assuma que todas as reservas têm as mesmas condições. Se já tem uma reserva e precisa de ajuda, utilize os canais de apoio indicados na plataforma.",

    travelReservations:
        "Se pretende reservar cruzeiros, hotéis ou resorts, consulte as opções disponíveis na plataforma para o destino e as datas que procura. Antes de confirmar uma reserva, verifique o que está incluído, como pode utilizar os seus benefícios, os pagamentos a seu cargo e as condições de cancelamento. A disponibilidade e as condições devem ser verificadas em cada reserva.",

    travel:
        "Como Membro, pode aproveitar os benefícios do clube de viagens para planear novas experiências. Esta opção está relacionada apenas com viagens. Se também pretende conhecer o projeto e a possibilidade de obter renda extra em USD através de comissões, a opção a explorar é a de Sócio Membro.",

    project:
        "Como Sócio Membro, pode combinar os benefícios de viagens com uma atividade independente, apresentando o clube a outras pessoas. Existe a possibilidade de receber comissões conforme o plano de compensação e os requisitos oficiais, mas não existem rendimentos garantidos. Se pretende apenas aproveitar os benefícios de viagens, a opção é Membro. Pode continuar a perguntar aqui sobre a atividade para perceber se corresponde aos seus objetivos.",

    cost:
        "Antes de aderir como Membro, procure conhecer o custo de adesão, os pagamentos recorrentes e o que está incluído na opção que pretende escolher. Verifique também como são utilizados os benefícios nas reservas e que despesas ficam a seu cargo. Este assistente não apresenta valores atualizados.",


    /* ==========================================
       RESPOSTAS ESPECÍFICAS - PROJETO
    ========================================== */

    projectHow:
        "Como Sócio Membro, pode aproveitar os benefícios de viagens e desenvolver uma atividade independente, apresentando o clube a outras pessoas. Esta atividade oferece a possibilidade de obter renda extra em USD através de comissões, de acordo com o plano e as condições oficiais. Envolve aprendizagem, comunicação e acompanhamento constante.",

    projectMobility:
        "A atividade como Sócio Membro pode ser desenvolvida à distância, utilizando as ferramentas online disponíveis. Isso permite organizar tarefas a partir de casa ou durante uma viagem, tendo em conta a ligação à internet, a sua disponibilidade e as condições aplicáveis à atividade em cada país. Esta flexibilidade exige organização para manter a aprendizagem, a comunicação e o acompanhamento das pessoas.",

    projectDifference:
        "O Membro tem acesso aos benefícios do clube de viagens, sem desenvolver a atividade do projeto. O Sócio Membro combina os benefícios de viagens com uma atividade independente, que pode permitir obter renda extra em USD através de comissões, conforme o plano e as condições oficiais.",

    projectReady:
        "Antes de continuar com a Vivian, confirme: já esclareceu as suas principais dúvidas sobre o funcionamento, os custos e os requisitos, e decidiu avançar? Pretende aderir como Membro apenas para viagens ou como Sócio Membro, para viagens e atividade independente?",

    projectStart:
        "Vamos começar por esclarecer as suas dúvidas aqui no assistente, para que possa conhecer a atividade como Sócio Membro e perceber se corresponde aos seus objetivos. Antes de decidir, procure compreender o funcionamento, os custos e os requisitos. O que gostaria de esclarecer primeiro?",

    projectTime:
        "O tempo que dedica ao projeto deve ter em conta a sua disponibilidade e os seus objetivos. Pode começar por reservar momentos regulares durante a semana para aprender, comunicar e acompanhar pessoas. Mais do que escolher um número de horas, importa definir uma rotina que consiga manter. Antes de decidir avançar como Sócio Membro, procure compreender as tarefas envolvidas e avaliar como se adaptam ao tempo que tem disponível.",

    projectSupport:
        "Antes de iniciar como Sócio Membro, é importante compreender que acompanhamento está disponível, que ferramentas poderá utilizar e que recursos de aprendizagem existem. O apoio não substitui a sua participação, aprendizagem e organização. Continue a esclarecer as suas dúvidas aqui no assistente. Se decidir avançar, poderá confirmar com a Vivian os detalhes do acompanhamento durante o processo de adesão.",

    projectParallel:
        "Pode explorar a atividade como Sócio Membro em paralelo com o seu trabalho, organizando o tempo que tem disponível para aprender, comunicar e acompanhar pessoas. Começar de forma gradual permite avaliar como o projeto se adapta à sua rotina. A flexibilidade exige organização e consistência.",

    projectExperience:
        "Se está a começar, é natural ter dúvidas. O importante é estar disponível para aprender, desenvolver a comunicação e conhecer as ferramentas e condições da atividade como Sócio Membro. Antes de decidir, procure compreender as tarefas envolvidas e o acompanhamento disponível. Pode perguntar aqui sobre esses temas para perceber melhor como a atividade  poderá adaptar-se à sua experiência.",

    projectIncomeTime:
        "Não é possível garantir um prazo para começar a receber comissões. Isso depende do cumprimento dos requisitos do plano de compensação e do desenvolvimento da sua atividade. Dedicar tempo ao projeto não garante ganhos. Antes de decidir avançar como Sócio Membro, procure compreender os critérios oficiais para receber comissões e avaliar a atividade sem contar com ganhos num prazo determinado.",

    projectIncome:
        "Como Sócio Membro, pode desenvolver a atividade apresentando o clube de viagens a outras pessoas e acompanhando quem demonstra interesse. A possibilidade de receber comissões depende do plano de compensação e do cumprimento dos requisitos oficiais. Pode conhecer esta atividade com o objetivo de obter renda extra, mas não existem rendimentos garantidos e os resultados variam de pessoa para pessoa. Antes de decidir avançar, procure compreender o plano de compensação e os critérios aplicáveis.",

    projectConditions:
        "Antes de começar como Sócio Membro, procure conhecer o custo de adesão, eventuais pagamentos recorrentes e os requisitos para desenvolver a atividade e receber comissões. Este assistente não apresenta valores atualizados. Consulte as informações oficiais para confirmar os custos e as condições em vigor antes de decidir avançar.",

    projectFallback:
        "Não consegui entender exatamente qual é a sua dúvida. Pode escrever, por exemplo: “como funciona?”, “quanto custa?”, “existem rendimentos garantidos?” ",


    contact:
        "Antes de continuar pelo WhatsApp com a Vivian, vamos esclarecer as suas dúvidas aqui no assistente. Está interessado em viajar como Membro ou em combinar os benefícios de viagens com a atividade como Sócio Membro? O que gostaria de compreender melhor antes de decidir avançar?",

    fallback:
        "Não consegui identificar a sua dúvida. Pode reformular a pergunta ou escrever, por exemplo: “Como funciona?”, “Quanto custa ser Membro?” ou “Qual é a diferença entre Membro e Sócio Membro?”."

};

let assistantAwaitingAdvanceConfirmation = false;
let assistantWhatsAppUnlocked = false;
let assistantMembershipChoice = "";
const assistantClarifiedTopics = new Set();

let assistantConversationVersion = 0;

let assistantPendingClarification = [];

function askAssistantClarification(options) {
    assistantAwaitingAdvanceConfirmation = false;
    assistantPendingClarification = options;

    const choices = options
        .map((option, index) => `${index + 1}. ${option.label}`)
        .join("\n");

    addMessage(
        "Para responder melhor à sua pergunta, qual destes temas quer esclarecer primeiro?\n\n" +
        choices +
        "\n\nPode escrever o número ou o nome do tema.",
        "bot"
    );
}

function answerIntent(intent) {
    assistantPendingClarification = [];

    if (
        assistantFilterEnabled &&
        (intent === "fallback" || intent === "projectFallback")
    ) {
        askAssistantClarification([
            {
                label: "Viajar como Membro",
                intent: "travel",
                aliases: ["viagens", "viajar", "membro"]
            },
            {
                label: "Atividade como Sócio Membro",
                intent: "projectHow",
                aliases: ["projeto", "atividade", "socio membro"]
            },
            {
                label: "Diferença entre Membro e Sócio Membro",
                intent: "projectDifference",
                aliases: ["diferenca", "comparar"]
            }
        ]);

        return;
    }

    if (
        assistantFilterEnabled &&
        intent === "contact" &&
        assistantWhatsAppUnlocked
    ) {

        addMessage(
            `Já confirmou que pretende avançar como ${assistantMembershipChoice}. Clique em “Falar pelo WhatsApp” nas sugestões do assistente para continuar com a Vivian.`,
            "bot"
        );

        return;
    }

    if (
        assistantFilterEnabled &&
        intent === "projectReady" &&
        assistantClarifiedTopics.size < 2
    ) {

        assistantAwaitingAdvanceConfirmation = false;
        assistantWhatsAppUnlocked = false;
        assistantMembershipChoice = "";

        addMessage(
            "Antes de avançar, vamos explorar pelo menos dois temas diferentes aqui no assistente para apoiar a sua decisão. Pode perguntar, por exemplo: “Como funciona?”, “Quais são os custos e requisitos?” ou “Qual é a diferença entre Membro e Sócio Membro?”. O que gostaria de esclarecer?",
            "bot"
        );

        return;
    }

    assistantAwaitingAdvanceConfirmation = (intent === "projectReady");

    if (intent === "projectReady") {
        assistantWhatsAppUnlocked = false;
        assistantMembershipChoice = "";
    }

    const responseConversationVersion =
        assistantConversationVersion;

    setTimeout(() => {
        if (
            responseConversationVersion !==
            assistantConversationVersion
        ) {
            return;
        }
        if (
            assistantFilterEnabled &&
            [
                "travel",
                "travelReservations",
                "travelCancellation",
                "travelBenefits",
                "travelMemberBenefits",
                "cost",
                "project",
                "projectHow",
                "projectDifference",
                "projectMobility",
                "projectTime",
                "projectSupport",
                "projectParallel",
                "projectExperience",
                "projectIncomeTime",
                "projectIncome",
                "projectConditions",
                "projectTasks"
            ].includes(intent)
        ) {

            const clarifiedTopic =
                intent === "travelMemberBenefits"
                    ? "travelBenefits"
                    : intent === "projectHow"
                        ? "project"
                        : intent;

            assistantClarifiedTopics.add(clarifiedTopic);
        }

        if (intent === "projectEvaluate") {
            assistantPendingClarification = [
                {
                    label: "Tempo",
                    intent: "projectTime",
                    aliases: ["o tempo", "tempo disponivel"]
                },
                {
                    label: "Custos",
                    intent: "projectConditions",
                    aliases: ["os custos", "custo", "valores"]
                },
                {
                    label: "Tarefas da atividade",
                    intent: "projectTasks",
                    aliases: ["tarefas", "as tarefas", "atividade"]
                }
            ];
        }

        addMessage(
            answers[intent] ||
            answers.fallback,
            "bot"
        );

    }, 300);

}



document
    .querySelectorAll("[data-intent]")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const intent =
                    button.dataset.intent;

                addMessage(
                    button.textContent.trim(),
                    "user"
                );


                if (
                    intent === "projectFit" &&
                    isProjectPage
                ) {

                    startProjectQualification();

                    return;

                }


                answerIntent(intent);

            }
        );

    });

const isProjectPage =
    Boolean(
        document.querySelector(
            ".project-page-hero"
        )
    );

const isTravelPage = Boolean(
    document.querySelector(".travel-page-hero")
);

const isHomePage = Boolean(
    document.querySelector("#discoverButton")
);

const assistantFilterEnabled =
    isProjectPage || isTravelPage || isHomePage;
const assistantOptions =
    document.querySelector(
        ".assistant-options"
    );

let projectQualificationStep = 0;

const projectQualificationData = {
    interest: "",
    time: "",
    communication: ""
};

function startProjectQualification() {
    assistantPendingClarification = [];

    assistantAwaitingAdvanceConfirmation = false;
    assistantWhatsAppUnlocked = false;
    assistantMembershipChoice = "";

    projectQualificationStep = 1;


    if (assistantOptions) {

        assistantOptions.classList.add(
            "qualification-hidden"
        );

    }


    addMessage(
        "Para começar: o que mais despertou o seu interesse — viajar mais, desenvolver uma atividade independente, ambos ou apenas conhecer melhor?",
        "bot"
    );

}


function continueProjectQualification(text) {

    if (projectQualificationStep === 1) {

        projectQualificationData.interest = text;

        projectQualificationStep = 2;

        addMessage(
            "Entendi. Pensando na sua rotina atual, quanto tempo por semana imagina que conseguiria dedicar a aprender e desenvolver esta atividade?",
            "bot"
        );

        return;

    }


    if (projectQualificationStep === 2) {

        projectQualificationData.time = text;

        projectQualificationStep = 3;

        addMessage(
            "E sente-se confortável em conversar com outras pessoas, apresentar ideias e aprender a comunicar o conceito?",
            "bot"
        );

        return;

    }


    if (projectQualificationStep === 3) {

        projectQualificationData.communication = text;

        projectQualificationStep = 0;


        if (assistantOptions) {

            assistantOptions.classList.remove(
                "qualification-hidden"
            );

        }


        addMessage(
            "Obrigado pelas suas respostas. Continue a esclarecer aqui as suas dúvidas sobre o funcionamento, os custos e os requisitos da atividade como Sócio Membro. Quando tiver esclarecido as suas principais dúvidas e decidir avançar, escreva “Quero avançar” para iniciar a confirmação.",
            "bot"
        );

        return;

    }

}

if (assistantForm && assistantInput) {

    assistantForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const text =
                assistantInput.value.trim();

            if (!text) return;


            addMessage(
                text,
                "user"
            );


            assistantInput.value = "";

            if (
                isProjectPage &&
                projectQualificationStep > 0
            ) {

                continueProjectQualification(text);

                return;

            }


            const value =
                text.toLowerCase();


            let intent =
                "fallback";

            const advanceConfirmation = value
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/\s+/g, " ")
                .trim()
                .replace(/[.!?]+$/, "")
                .trim();

            if (assistantPendingClarification.length > 0) {
                const selectedOption = assistantPendingClarification.find(
                    (option, index) => {
                        const names = [
                            option.label,
                            ...(option.aliases || [])
                        ];

                        return (
                            advanceConfirmation === String(index + 1) ||
                            names.some(name =>
                                advanceConfirmation === name
                                    .toLowerCase()
                                    .normalize("NFD")
                                    .replace(/[\u0300-\u036f]/g, "")
                                    .trim()
                            )
                        );
                    }
                );

                assistantPendingClarification = [];

                if (selectedOption) {
                    answerIntent(selectedOption.intent);
                    return;
                }
            }


            /* ==========================================
               SE ESTIVER NA PÁGINA PROJETO
            ========================================== */

            if (assistantFilterEnabled) {
                if (
                    assistantAwaitingAdvanceConfirmation &&
                    /^(nao|ainda nao|nao esclareci|ainda tenho duvidas|tenho duvidas)$/.test(advanceConfirmation)
                ) {
                    assistantWhatsAppUnlocked = false;
                    assistantAwaitingAdvanceConfirmation = false;

                    addMessage(
                        "Vamos continuar a esclarecer as suas dúvidas aqui. O que gostaria de compreender melhor: o funcionamento, os custos, os benefícios de viagens ou a atividade como Sócio Membro?",
                        "bot"
                    );

                    return;
                }

                if (
                    assistantAwaitingAdvanceConfirmation &&
                    assistantMembershipChoice &&
                    /^(sim|sim, ja esclareci|ja esclareci|ja esclareci as minhas duvidas)$/.test(advanceConfirmation)
                ) {
                    assistantWhatsAppUnlocked = true;
                    assistantAwaitingAdvanceConfirmation = false;

                    addMessage(
                        `Confirmou que esclareceu as suas principais dúvidas e pretende avançar como ${assistantMembershipChoice}. Pode agora clicar em “Falar pelo WhatsApp” para continuar com a Vivian.`,
                        "bot"
                    );

                    return;
                }

                if (
                    assistantAwaitingAdvanceConfirmation &&
                    (
                        advanceConfirmation === "ja esclareci as minhas duvidas e confirmo que quero aderir como membro" ||
                        advanceConfirmation === "ja esclareci as minhas duvidas e confirmo que quero aderir como socio membro"
                    )
                ) {
                    assistantMembershipChoice =
                        advanceConfirmation.endsWith("socio membro")
                            ? "Sócio Membro"
                            : "Membro";

                    assistantWhatsAppUnlocked = true;
                    assistantAwaitingAdvanceConfirmation = false;

                    addMessage(
                        `Confirmou que esclareceu as suas principais dúvidas e pretende avançar como ${assistantMembershipChoice}. Pode agora clicar em “Falar pelo WhatsApp” para continuar com a Vivian.`,
                        "bot"
                    );

                    return;
                }

                if (
                    assistantAwaitingAdvanceConfirmation &&
                    /^(sim|(?:(?:quero|pretendo|desejo)\s+)?(?:aderir como\s+)?(?:membro|socio membro|socio-membro))$/.test(advanceConfirmation)
                ) {
                    if (/\bs[oó]cio[-\s]+membro\b/.test(value)) {
                        assistantMembershipChoice = "Sócio Membro";
                    } else if (/\bmembro\b/.test(value)) {
                        assistantMembershipChoice = "Membro";
                    }

                    addMessage(
                        assistantMembershipChoice
                            ? `Escolheu avançar como ${assistantMembershipChoice}. Já esclareceu as suas principais dúvidas sobre o funcionamento, os custos e os requisitos?`
                            : "Pretende avançar como Membro, apenas para viagens, ou como Sócio Membro, para viagens e atividade independente?",
                        "bot"
                    );

                    return;
                }

                if (
                    /^(sim|ok|okay|entendi|percebi|obrigado|obrigada)[.!?]*$/.test(
                        value.trim()
                    )
                ) {

                    addMessage(
                        "Entendido. Se tiver outra dúvida, pode escrevê-la aqui.",
                        "bot"
                    );

                    return;

                }

                if (
                    /\bnao (?:quero|pretendo|desejo|vou) (?:avancar|aderir)\b/.test(advanceConfirmation)
                ) {
                    assistantAwaitingAdvanceConfirmation = false;
                    assistantWhatsAppUnlocked = false;
                    assistantMembershipChoice = "";

                    addMessage(
                        "Entendido. Pode continuar a conhecer o conceito e esclarecer dúvidas aqui, sem decidir aderir.",
                        "bot"
                    );

                    return;
                }

            }

            if (
                (isTravelPage || isHomePage) &&
                (
                    /^(?:(?:quero|pretendo|desejo)\s+)?avancar?$/.test(advanceConfirmation) ||
                    advanceConfirmation.includes("quero avancar") ||
                    advanceConfirmation.includes("decidi avancar") ||
                    advanceConfirmation.includes("quero aderir")
                )
            ) {
                answerIntent("projectReady");
                return;
            }

            if (
                assistantFilterEnabled &&
                (
                    advanceConfirmation.includes("cancel") ||
                    advanceConfirmation.includes("desistir") ||
                    advanceConfirmation.includes("deixar de ser membro") ||
                    advanceConfirmation.includes("deixar de ser socio membro")
                ) &&
                (
                    advanceConfirmation.includes("adesao") ||
                    advanceConfirmation.includes("assinatura") ||
                    advanceConfirmation.includes("mensalidade") ||
                    advanceConfirmation.includes("de ser membro") ||
                    advanceConfirmation.includes("de ser socio membro") ||
                    advanceConfirmation.includes("deixar de ser membro") ||
                    advanceConfirmation.includes("deixar de ser socio membro")
                )
            ) {
                answerIntent("membershipCancellation");
                return;
            }

            if (
                assistantFilterEnabled &&
                advanceConfirmation.includes("reserv") &&
                (
                    advanceConfirmation.includes("cancel") ||
                    advanceConfirmation.includes("reembolso") ||
                    advanceConfirmation.includes("desistir") ||
                    advanceConfirmation.includes("devolvem-me o dinheiro") ||
                    advanceConfirmation.includes("devolvem o dinheiro") ||
                    advanceConfirmation.includes("receber o dinheiro de volta") ||
                    advanceConfirmation.includes("dinheiro de volta")
                )
            ) {
                if (
                    advanceConfirmation.includes("beneficio") &&
                    (
                        advanceConfirmation.includes("utilizar") ||
                        advanceConfirmation.includes("usar") ||
                        advanceConfirmation.includes("aplicar")
                    )
                ) {
                    askAssistantClarification([
                        {
                            label: "Utilizar benefícios numa reserva",
                            intent: "travelBenefits",
                            aliases: ["beneficios", "utilizar beneficios"]
                        },
                        {
                            label: "Cancelar uma reserva",
                            intent: "travelCancellation",
                            aliases: ["cancelar", "cancelamento", "reembolso"]
                        }
                    ]);
                } else {
                    answerIntent("travelCancellation");
                }

                return;
            }

            if (
                assistantFilterEnabled &&
                advanceConfirmation.includes("tarefas") &&
                (
                    advanceConfirmation.includes("socio membro") ||
                    advanceConfirmation.includes("socio-membro") ||
                    advanceConfirmation.includes("atividade") ||
                    advanceConfirmation.includes("projeto")
                )
            ) {
                answerIntent("projectTasks");
                return;
            }

            if (
                assistantFilterEnabled &&
                (
                    advanceConfirmation.includes("compensa") ||
                    advanceConfirmation.includes("vale a pena")
                ) &&
                (
                    advanceConfirmation.includes("socio membro") ||
                    advanceConfirmation.includes("socio-membro") ||
                    advanceConfirmation.includes("atividade") ||
                    advanceConfirmation.includes("projeto")
                )
            ) {
                answerIntent("projectEvaluate");
                return;
            }

            if (
                assistantFilterEnabled &&
                (
                    advanceConfirmation.includes("compensa") ||
                    advanceConfirmation.includes("vale a pena")
                ) &&
                (
                    advanceConfirmation.includes("viaj") ||
                    advanceConfirmation.includes("clube") ||
                    advanceConfirmation.includes("membro")
                ) &&
                !advanceConfirmation.includes("socio") &&
                !advanceConfirmation.includes("atividade") &&
                !advanceConfirmation.includes("projeto")
            ) {
                answerIntent("travelMemberBenefits");
                return;
            }

            if (
                assistantFilterEnabled &&
                !assistantAwaitingAdvanceConfirmation &&
                advanceConfirmation.includes("experiencia") &&
                (
                    advanceConfirmation.includes("conciliar") ||
                    advanceConfirmation.includes("em paralelo") ||
                    advanceConfirmation.includes("sem deixar o meu emprego") ||
                    advanceConfirmation.includes("sem deixar meu emprego") ||
                    advanceConfirmation.includes("sem deixar o trabalho") ||
                    advanceConfirmation.includes("sem sair do emprego")
                ) &&
                (
                    advanceConfirmation.includes("atividade") ||
                    advanceConfirmation.includes("projeto") ||
                    advanceConfirmation.includes("socio membro")
                )
            ) {
                askAssistantClarification([
                    {
                        label: "Começar sem experiência",
                        intent: "projectExperience",
                        aliases: ["experiencia", "sem experiencia"]
                    },
                    {
                        label: "Conciliar a atividade com o trabalho",
                        intent: "projectParallel",
                        aliases: ["conciliar", "trabalho", "emprego"]
                    }
                ]);

                return;
            }

            if (
                assistantFilterEnabled &&
                !assistantAwaitingAdvanceConfirmation &&
                (
                    advanceConfirmation.includes("conciliar") ||
                    advanceConfirmation.includes("em paralelo")
                ) &&
                (
                    advanceConfirmation.includes("que apoio") ||
                    advanceConfirmation.includes("qual o apoio") ||
                    advanceConfirmation.includes("vou ter apoio") ||
                    advanceConfirmation.includes("ter acompanhamento")
                ) &&
                (
                    advanceConfirmation.includes("atividade") ||
                    advanceConfirmation.includes("projeto") ||
                    advanceConfirmation.includes("socio membro")
                )
            ) {
                askAssistantClarification([
                    {
                        label: "Conciliar a atividade com o trabalho",
                        intent: "projectParallel",
                        aliases: ["conciliar", "trabalho", "em paralelo"]
                    },
                    {
                        label: "Apoio e acompanhamento",
                        intent: "projectSupport",
                        aliases: ["apoio", "acompanhamento", "suporte"]
                    }
                ]);

                return;
            }

            if (
                assistantFilterEnabled &&
                !assistantAwaitingAdvanceConfirmation &&
                (
                    advanceConfirmation.includes("quanto custa") ||
                    advanceConfirmation.includes("quais sao os custos") ||
                    advanceConfirmation.includes("qual e o custo") ||
                    advanceConfirmation.includes("qual o custo") ||
                    advanceConfirmation.includes("custo de adesao") ||
                    advanceConfirmation.includes("quanto tenho de pagar") ||
                    advanceConfirmation.includes("quanto tenho que pagar")) &&
                (
                    advanceConfirmation.includes("como posso receber comissoes") ||
                    advanceConfirmation.includes("como receber comissoes") ||
                    advanceConfirmation.includes("como posso ganhar comissoes") ||
                    advanceConfirmation.includes("como ganhar comissoes") ||
                    advanceConfirmation.includes("como funcionam as comissoes") ||
                    advanceConfirmation.includes("de que forma posso ganhar comissoes") ||
                    advanceConfirmation.includes("de que forma posso receber comissoes"))
            ) {
                askAssistantClarification([
                    {
                        label: "Custos para ser Sócio Membro",
                        intent: "projectConditions",
                        aliases: ["custos", "custo", "adesao"]
                    },
                    {
                        label: "Como funcionam as comissões",
                        intent: "projectIncome",
                        aliases: ["comissoes", "comissao", "ganhos"]
                    }
                ]);

                return;
            }

            if (isProjectPage) {

                if (
                    /^(?:(?:quero|pretendo|desejo)\s+)?avan[cç]ar?[.!?]*$/.test(value.trim()) ||
                    value.includes("quero avançar") ||
                    value.includes("quero avancar") ||
                    value.includes("decidi avançar") ||
                    value.includes("decidi avancar") ||
                    value.includes("quero aderir")
                ) {
                    intent = "projectReady";
                }

                else if (
                    value.includes("falar com a vivian") ||
                    value.includes("contactar a vivian") ||
                    value.includes("contatar a vivian") ||
                    value.includes("whatsapp")
                ) {
                    intent = "contact";
                }

                else if (
                    /^(sócio membro|socio membro|sócio-membro|socio-membro)[.!?]*$/.test(value.trim())
                ) {
                    intent = "projectHow";
                }

                else if (
                    /^membro[.!?]*$/.test(value.trim())
                ) {
                    intent = "travel";
                }

                else if (
                    (
                        value.includes("diferença") ||
                        value.includes("diferenca")
                    ) &&
                    value.includes("membro")
                ) {
                    intent = "projectDifference";
                }

                else if (
                    (
                        value.includes("quanto tempo") ||
                        value.includes("demora") ||
                        value.includes("quando") ||
                        value.includes("prazo")
                    ) &&
                    (
                        value.includes("ganh") ||
                        value.includes("comissão") ||
                        value.includes("comissao") ||
                        value.includes("comissões") ||
                        value.includes("comissoes") ||
                        value.includes("rendimento") ||
                        value.includes("renda extra")
                    )
                ) {
                    intent = "projectIncomeTime";
                }

                else if (
                    value.includes("quanto tempo") ||
                    value.includes("quantas horas") ||
                    value.includes("dedicar") ||
                    value.includes("dedicação") ||
                    value.includes("dedicacao")
                ) {
                    intent = "projectTime";
                }

                else if (
                    value.includes("apoio") ||
                    value.includes("acompanhamento") ||
                    value.includes("suporte")
                ) {
                    intent = "projectSupport";
                }

                else if (
                    value.includes("paralelo") ||
                    value.includes("conciliar")
                ) {
                    intent = "projectParallel";
                }

                else if (
                    value.includes("experiência") ||
                    value.includes("experiencia")
                ) {
                    intent = "projectExperience";
                }

                else if (
                    value.includes("requisito")
                ) {
                    intent = "projectConditions";
                }

                else if (
                    value.includes("rendimento") ||
                    value.includes("renda extra") ||
                    value.includes("ganh") ||
                    value.includes("comissão") ||
                    value.includes("comissao") ||
                    value.includes("comissões") ||
                    value.includes("comissoes") ||
                    value.includes("dinheiro")
                ) {

                    intent =
                        "projectIncome";

                }


                else if (
                    value.includes("preço") ||
                    value.includes("preco") ||
                    value.includes("custo") ||
                    value.includes("custa") ||
                    value.includes("valor") ||
                    value.includes("condição") ||
                    value.includes("condicao") ||
                    value.includes("condições") ||
                    value.includes("condicoes") ||
                    value.includes("taxa")
                ) {
                    const refersToProject =
                        /\bsocio[-\s]+membro\b/.test(advanceConfirmation) ||
                        value.includes("partner") ||
                        value.includes("projeto") ||
                        value.includes("atividade") ||
                        advanceConfirmation.includes("comiss");

                    intent =
                        /\bmembro\b/.test(advanceConfirmation) && !refersToProject
                            ? "cost"
                            : "projectConditions";
                }


                else if (
                    value.includes("contact") ||
                    value.includes("whatsapp") ||
                    value.includes("falar") ||
                    value.includes("contactar")
                ) {

                    intent =
                        "contact";

                }

                else if (
                    /\bviajar como socio[-\s]+membro\b/.test(advanceConfirmation)
                ) {
                    intent = "projectHow";
                }

                else if (
                    (
                        value.includes("projeto") ||
                        value.includes("atividade") ||
                        value.includes("sócio") ||
                        value.includes("socio")
                    ) &&
                    (
                        value.includes("casa") ||
                        value.includes("viaj") ||
                        value.includes("viagem") ||
                        value.includes("viagens") ||
                        value.includes("distância") ||
                        value.includes("distancia") ||
                        value.includes("liberdade geográfica") ||
                        value.includes("liberdade geografica")
                    )
                ) {
                    intent = "projectMobility";
                }

                else if (
                    value.includes("viaj") ||
                    value.includes("viagem") ||
                    value.includes("viagens") ||
                    value.includes("cruzeiro") ||
                    value.includes("hotel") ||
                    value.includes("resort") ||
                    value.includes("membership")
                ) {
                    intent = "travel";
                }

                else if (
                    value.includes("começar") ||
                    value.includes("comecar") ||
                    value.includes("quero ser sócio membro") ||
                    value.includes("quero ser socio membro") ||
                    value.includes("tornar sócio membro") ||
                    value.includes("tornar socio membro") ||
                    value.includes("aderir") ||
                    value.includes("adesão") ||
                    value.includes("adesao")
                ) {
                    intent = "projectStart";
                }


                else if (
                    value.includes("partner") ||
                    value.includes("projeto") ||
                    value.includes("atividade") ||
                    value.includes("oportunidade") ||
                    value.includes("funciona")
                ) {

                    intent =
                        "projectHow";

                }


                else {

                    intent =
                        "projectFallback";

                }

            }



            /* ==========================================
               RESTO DO SITE
            ========================================== */

            else {

                if (
                    isHomePage &&
                    /^(quanto custa|quanto custa aderir|qual o custo|qual e o custo|quais sao os custos|custos|preco|precos|valores)$/.test(advanceConfirmation)
                ) {
                    askAssistantClarification([
                        {
                            label: "Custos para ser Membro",
                            intent: "cost",
                            aliases: ["membro", "viagens"]
                        },
                        {
                            label: "Custos para ser Sócio Membro",
                            intent: "projectConditions",
                            aliases: ["socio membro", "projeto", "atividade"]
                        }
                    ]);

                    return;
                }

                else if (
                    isHomePage &&
                    advanceConfirmation === "como funciona"
                ) {
                    intent = "projectDifference";
                }

                else if (
                    advanceConfirmation.includes("diferenca") &&
                    advanceConfirmation.includes("membro")
                ) {
                    intent = "projectDifference";
                }

                else if (
                    (isTravelPage || isHomePage) &&
                    /^(quais (?:sao )?os beneficios de ser membro|quais beneficios tenho como membro|quais os beneficios para membros)$/.test(advanceConfirmation)
                ) {
                    intent = "travelMemberBenefits";
                }

                else if (
                    (isTravelPage || isHomePage) &&
                    advanceConfirmation.includes("beneficio") &&
                    (
                        advanceConfirmation.includes("utiliz") ||
                        advanceConfirmation.includes("usar") ||
                        advanceConfirmation.includes("funcion") ||
                        advanceConfirmation.includes("aplic") ||
                        advanceConfirmation.includes("cobr") ||
                        advanceConfirmation.includes("despesa")
                    )
                ) {
                    intent = "travelBenefits";
                }

                else if (
                    (isTravelPage || isHomePage) &&
                    advanceConfirmation.includes("reserv") &&
                    (
                        advanceConfirmation.includes("cruzeiro") ||
                        advanceConfirmation.includes("hotel") ||
                        advanceConfirmation.includes("hoteis") ||
                        advanceConfirmation.includes("resort") ||
                        advanceConfirmation.includes("beneficio")
                    )
                ) {
                    intent = "travelReservations";
                }

                else if (

                    value.includes("preço") ||
                    value.includes("preco") ||
                    value.includes("custo") ||
                    value.includes("custa") ||
                    value.includes("valor") ||
                    value.includes("requisito") ||
                    advanceConfirmation.includes("condicao") ||
                    advanceConfirmation.includes("condicoes")
                ) {
                    const refersToProject =

                        /\bsocio[-\s]+membro\b/.test(advanceConfirmation) ||
                        value.includes("partner") ||
                        value.includes("projeto") ||
                        value.includes("atividade") ||
                        advanceConfirmation.includes("comiss");

                    intent = refersToProject
                        ? "projectConditions"
                        : "cost";
                }

                else if (
                    (
                        isHomePage || isTravelPage
                    ) &&
                    (
                        advanceConfirmation.includes("conciliar") ||
                        advanceConfirmation.includes("paralelo") ||
                        advanceConfirmation.includes("sem deixar o meu emprego") ||
                        advanceConfirmation.includes("sem deixar meu emprego") ||
                        advanceConfirmation.includes("sem deixar o trabalho") ||
                        advanceConfirmation.includes("sem sair do emprego")
                    )
                ) {
                    intent = "projectParallel";
                }

                else if (
                    (isHomePage || isTravelPage) &&
                    advanceConfirmation.includes("experiencia") &&
                    (
                        /\bsocio[-\s]+membro\b/.test(advanceConfirmation) ||
                        advanceConfirmation.includes("projeto") ||
                        advanceConfirmation.includes("atividade") ||
                        advanceConfirmation.includes("vendas")
                    )
                ) {
                    intent = "projectExperience";
                }

                else if (
                    (isHomePage || isTravelPage) &&
                    (
                        advanceConfirmation.includes("apoio") ||
                        advanceConfirmation.includes("acompanhamento") ||
                        advanceConfirmation.includes("suporte")
                    ) &&
                    (
                        /\bsocio[-\s]+membro\b/.test(advanceConfirmation) ||
                        advanceConfirmation.includes("projeto") ||
                        advanceConfirmation.includes("atividade")
                    )
                ) {
                    intent = "projectSupport";
                }

                else if (
                    (isHomePage || isTravelPage) &&
                    (
                        advanceConfirmation.includes("quantas horas") ||
                        advanceConfirmation.includes("tempo por semana") ||
                        advanceConfirmation.includes("dedicar") ||
                        advanceConfirmation.includes("dedicacao")
                    ) &&
                    (
                        /\bsocio[-\s]+membro\b/.test(advanceConfirmation) ||
                        advanceConfirmation.includes("projeto") ||
                        advanceConfirmation.includes("atividade")
                    )
                ) {
                    intent = "projectTime";
                }

                else if (
                    (isHomePage || isTravelPage) &&
                    (
                        advanceConfirmation.includes("quanto tempo") ||
                        advanceConfirmation.includes("quando") ||
                        advanceConfirmation.includes("prazo")
                    ) &&
                    (
                        advanceConfirmation.includes("comiss") ||
                        advanceConfirmation.includes("ganh") ||
                        advanceConfirmation.includes("rendimento") ||
                        advanceConfirmation.includes("renda extra")
                    )
                ) {
                    intent = "projectIncomeTime";
                }

                else if (
                    (isHomePage || isTravelPage) &&
                    (
                        advanceConfirmation.includes("renda extra") ||
                        advanceConfirmation.includes("rendimento") ||
                        advanceConfirmation.includes("comiss") ||
                        advanceConfirmation.includes("ganh")
                    )
                ) {
                    intent = "projectIncome";
                }

                else if (
                    (isHomePage || isTravelPage) &&
                    (
                        /\bsocio[-\s]+membro\b/.test(advanceConfirmation) ||
                        advanceConfirmation.includes("projeto") ||
                        advanceConfirmation.includes("atividade")
                    ) &&
                    (
                        advanceConfirmation.includes("a partir de casa") ||
                        advanceConfirmation.includes("trabalhar de casa") ||
                        advanceConfirmation.includes("durante uma viagem") ||
                        advanceConfirmation.includes("a distancia") ||
                        advanceConfirmation.includes("liberdade geografica")
                    )
                ) {
                    intent = "projectMobility";
                }

                else if (
                    value.includes("partner") ||
                    value.includes("projeto") ||
                    value.includes("atividade") ||
                    value.includes("sócio membro") ||
                    value.includes("socio membro") ||
                    value.includes("negócio") ||
                    value.includes("negocio") ||
                    value.includes("oportunidade")
                ) {
                    intent = "project";
                }

                else if (
                    (
                        isTravelPage &&
                        /^(como funciona|como funciona o clube|como funciona o clube de viagens)$/.test(advanceConfirmation)
                    ) ||
                    value.includes("viaj") ||
                    value.includes("viagem") ||
                    value.includes("viagens") ||
                    /^membro[.!?]*$/.test(value.trim()) ||
                    value.includes("cruzeiro") ||
                    value.includes("hotel") ||
                    advanceConfirmation.includes("hoteis") ||
                    value.includes("resort") ||
                    (
                        advanceConfirmation.includes("beneficio") &&
                        advanceConfirmation.includes("membro")
                    )
                ) {

                    intent =
                        "travel";

                }

                else if (
                    value.includes("contact") ||
                    value.includes("whatsapp") ||
                    value.includes("falar")
                ) {

                    intent =
                        "contact";

                }

            }


            answerIntent(intent);

        }
    );
}


/* MENU MOBILE */

const sidebar =
    document.querySelector("#sidebar");

const mobileMenuButton =
    document.querySelector("#mobileMenuButton");

if (mobileMenuButton && sidebar) {

    mobileMenuButton.setAttribute(
        "aria-controls",
        "sidebar"
    );

    if (!mobileMenuButton.hasAttribute("aria-expanded")) {
        mobileMenuButton.setAttribute(
            "aria-expanded",
            "false"
        );
    }

    mobileMenuButton.addEventListener(
        "click",
        () => {
            const isOpen =
                sidebar.classList.toggle("open");

            mobileMenuButton.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );

            mobileMenuButton.setAttribute(
                "aria-label",
                isOpen ? "Fechar menu" : "Abrir menu"
            );
        }
    );
}

if (sidebar && mobileMenuButton) {

    sidebar
        .querySelectorAll("a, #openAssistantMenu")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    sidebar.classList.remove("open");

                    mobileMenuButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                    mobileMenuButton.setAttribute(
                        "aria-label",
                        "Abrir menu"
                    );

                }
            );

        });

}

window.addEventListener(
    "resize",
    () => {

        if (!sidebar || !mobileMenuButton) return;

        if (
            mobileMenuButton.getClientRects().length === 0
        ) {

            sidebar.classList.remove("open");

            mobileMenuButton.setAttribute(
                "aria-expanded",
                "false"
            );

            mobileMenuButton.setAttribute(
                "aria-label",
                "Abrir menu"
            );

        }

    }
);

/* ==========================================
 MANTER O ASSISTENTE FORA DO RODAPÉ
========================================== */

const assistantButton =
    document.querySelector("#assistantFloating");

const pageFooter =
    document.querySelector(".disclaimer");


function adjustAssistantPosition() {

    if (!assistantButton || !pageFooter) return;


    const footerRect =
        pageFooter.getBoundingClientRect();


    const windowHeight =
        window.innerHeight;


    // posição normal do botão
    const defaultBottom =
        window.innerWidth <= 650 ? 14 : 25;


    // distância desejada entre botão e rodapé
    const gap = 5;


    /*
      Onde estaria o fundo do botão
      na posição normal
    */
    const normalButtonBottom =
        windowHeight - defaultBottom;


    /*
      Queremos que o fundo do botão
      fique antes do início do rodapé
    */
    const limit =
        footerRect.top - gap;


    if (normalButtonBottom > limit) {

        const overlap =
            normalButtonBottom - limit;


        assistantButton.style.bottom =
            `${defaultBottom + overlap}px`;

    } else {

        assistantButton.style.bottom =
            `${defaultBottom}px`;

    }

}


window.addEventListener(
    "scroll",
    adjustAssistantPosition
);


window.addEventListener(
    "resize",
    adjustAssistantPosition
);


adjustAssistantPosition();

/* ==========================================
   VÍDEO DO HERO
========================================== */

const heroVideo = document.querySelector("#heroVideo");

const customPlayButton =
    document.querySelector("#customPlayButton");

const videoCard =
    document.querySelector(".video-card");


if (heroVideo && customPlayButton && videoCard) {

    /* =========================
       CLICAR NO PLAY
    ========================== */

    customPlayButton.addEventListener(
        "click",
        () => {

            customPlayButton.classList.add(
                "playing"
            );

            videoCard.classList.add(
                "video-starting"
            );


            setTimeout(
                async () => {

                    try {

                        await heroVideo.play();

                        heroVideo.controls = true;


                        customPlayButton.classList.add(
                            "hidden"
                        );

                        customPlayButton.classList.remove(
                            "playing"
                        );


                        videoCard.classList.remove(
                            "video-starting"
                        );

                        videoCard.classList.add(
                            "video-playing"
                        );


                    } catch (error) {

                        console.error(
                            "Erro ao iniciar vídeo:",
                            error
                        );


                        customPlayButton.classList.remove(
                            "playing"
                        );

                        videoCard.classList.remove(
                            "video-starting"
                        );

                    }

                },
                420
            );

        }
    );


    /* =========================
       VÍDEO TERMINOU
    ========================== */

    heroVideo.addEventListener(
        "ended",
        () => {

            heroVideo.controls = false;

            heroVideo.pause();

            heroVideo.currentTime = 0;


            videoCard.classList.remove(
                "video-playing"
            );

            videoCard.classList.remove(
                "video-starting"
            );


            customPlayButton.classList.remove(
                "hidden"
            );

            customPlayButton.classList.remove(
                "playing"
            );


            /*
              Volta a apresentar
              a thumbnail/poster
            */

            heroVideo.load();

            customPlayButton.style.backgroundImage =
                `linear-gradient(rgba(6, 27, 51, 0.15), rgba(6, 27, 51, 0.15)), url("${heroVideo.poster}")`;

            customPlayButton.style.backgroundSize = "cover";
            customPlayButton.style.backgroundPosition = "center";
            customPlayButton.style.backgroundRepeat = "no-repeat";
        }
    );

}

/* ==========================================
   SCROLL - DESCOBRIR POSSIBILIDADES
========================================== */

const discoverButton =
    document.querySelector("#discoverButton");

const choiceSection =
    document.querySelector("#escolha");


if (discoverButton && choiceSection) {

    discoverButton.addEventListener(
        "click",
        (event) => {

            event.preventDefault();


            const sectionPosition =
                choiceSection.getBoundingClientRect().top
                + window.scrollY;


            /*
              Número positivo = desce um pouco mais
              e faz os cartões subirem no ecrã.
            */

            const extraScroll = 70;


            window.scrollTo({
                top: sectionPosition + extraScroll,
                behavior: "smooth"
            });

        }
    );

}

/* ==========================================
   SOBRE MIM - CTA ASSISTENTE
========================================== */

const aboutAssistantButton =
    document.querySelector("#aboutAssistantButton");


if (aboutAssistantButton) {

    aboutAssistantButton.addEventListener(
        "click",
        openAssistant
    );

}

/* ==========================================
   PÁGINA VIAJAR - ASSISTENTE
========================================== */

const travelHeroAssistant =
    document.querySelector(
        "#travelHeroAssistant"
    );

const travelFinalAssistant =
    document.querySelector(
        "#travelFinalAssistant"
    );


function openTravelAssistant() {

    openAssistant();

}


if (travelHeroAssistant) {

    travelHeroAssistant.addEventListener(
        "click",
        openTravelAssistant
    );

}


if (travelFinalAssistant) {

    travelFinalAssistant.addEventListener(
        "click",
        openTravelAssistant
    );

}

/* ==========================================
   PÁGINA PROJETO - ASSISTENTE
========================================== */

const projectHeroAssistant =
    document.querySelector(
        "#projectHeroAssistant"
    );

const projectFinalAssistant =
    document.querySelector(
        "#projectFinalAssistant"
    );


function openProjectAssistant() {

    openAssistant();

}


if (projectHeroAssistant) {

    projectHeroAssistant.addEventListener(
        "click",
        openProjectAssistant
    );

}


if (projectFinalAssistant) {

    projectFinalAssistant.addEventListener(
        "click",
        openProjectAssistant
    );

}

/* ==========================================================
   CONTACTO DIRETO - WHATSAPP
========================================================== */

const whatsappNumber = "351911835726";

function openWhatsAppContact() {

    const currentPage =
        window.location.pathname;

    let message =
        "Olá Vivian, vi o seu site e gostaria de falar consigo.";

    if (assistantWhatsAppUnlocked && assistantMembershipChoice === "Membro") {

        message =
            "Olá Vivian, esclareci as minhas principais dúvidas no assistente do seu site e pretendo avançar como Membro para aproveitar os benefícios de viagens. Gostaria de confirmar as condições atuais e receber orientação sobre a adesão.";

    } else if (assistantWhatsAppUnlocked && assistantMembershipChoice === "Sócio Membro") {

        message =
            "Olá Vivian, esclareci as minhas principais dúvidas no assistente do seu site e pretendo avançar como Sócio Membro, combinando os benefícios de viagens com a atividade independente. Gostaria de confirmar as condições atuais e receber orientação sobre a adesão.";

    } else if (currentPage.includes("projeto")) {

        message =
            "Olá Vivian, vi o seu site e gostaria de perceber melhor como funciona a atividade de Independent inCruises Partner.";

    } else if (currentPage.includes("viajar")) {

        message =
            "Olá Vivian, vi o seu site e gostaria de perceber melhor como funciona a Membership e as possibilidades de viagem.";

    }

    const whatsappURL =
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.open(
        whatsappURL,
        "_blank",
        "noopener,noreferrer"
    );
}


document
    .querySelectorAll('[data-intent="contact"]')
    .forEach(button => {

        button.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopImmediatePropagation();

                if (assistantFilterEnabled && assistantWhatsAppUnlocked) {
                    openWhatsAppContact();
                    return;
                }

                addMessage(button.textContent.trim(), "user");

                answerIntent("contact");

            },
            {
                capture: true
            }
        );

    });