var elt = document.getElementById('calculator');
var calculator = Desmos.GraphingCalculator(elt, {expressions: false});

document.getElementById("submitNumber").addEventListener("click", async e => {
    e.preventDefault();
    let number = parseInt(document.getElementById("number").value);
    const response = await fetch(`/graph/${number}`, {
        method: "GET",
        headers: {"Accept": "application/json"},
    });
    if (response.ok) {
        calculator.setBlank();
        const data = await response.json();
        for (let i = 0; i < data.expressions.length; i++) {
            calculator.setExpression({
                id: `${i + 1}`,
                latex: data.expressions[i],
                color: Desmos.Colors.BLUE
            });
        }
        for (let i = 0; i < data.dots.length; i++) {
            calculator.setExpression({
                id: `Dot ${i + 1}`,
                latex: data.dots[i],
                color: Desmos.Colors.BLUE,
                dragMode: Desmos.DragModes.NONE,
                pointStyle: Desmos.Styles.OPEN
            });
        }
        document.getElementById("numberOfSteps").innerText = `Number ${number} reached 1 in ${data.expressions.length} steps`;
        document.getElementById("highestValue").innerText = `The highest value is ${data.highestValue}`;
        calculator.setMathBounds({
            left: -1,
            right: data.expressions.length + 1,
            bottom: data.highestValue / -30,
            top: data.highestValue * 21 / 20
        });
    }
});