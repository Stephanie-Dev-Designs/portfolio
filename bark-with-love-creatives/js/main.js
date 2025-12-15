

//snow animation starts //
document.addEventListener("DOMContentLoaded", function() {

    const snowfallContainer = document.getElementById("snowfall");
    const snowflakeCount = 500;

    function createSnowflake() {
        const snowflake = document.createElement("div");
        snowflake.className = "snowflake";
        snowflake.style.left = Math.random() * 100 + "vw";
        snowflake.style.animationDuration = Math.random() * 3 + 2 + "s";
        snowfallContainer.appendChild(snowflake);

        snowflake.addEventListener("animationend", function() {
            snowflake.remove();
            createSnowflake();
        });
    }

    function createSnowflakes() {
        for (let i = 0; i < snowflakeCount; i++) {
            createSnowflake();
        }
    }

    createSnowflakes();
});

//snow animation ends //