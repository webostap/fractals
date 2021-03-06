
const depth_input = document.getElementById('depth');
const canvas = document.getElementById('f');
const animate_check = document.getElementById('animate');

canvas.width = 800;
canvas.height = 700;

const ctx = canvas.getContext('2d');
ctx.strokeStyle = '#fff';
ctx.lineWidth = 2;
ctx.beginPath();

let POINTS = [];

const mood_list = {
    dragon: {
        calc: ()=>{
            let x0 = canvas.width / 1.75,
                y0 = 165,
                x1 = canvas.width / 1.75,
                y1 = 615;

            POINTS.push({
                x: x0,
                y: y0
            });

            Dragon (POINTS, depth_input.value, x0, y0, x1, y1);
        },
        depth: 9,
        max_depth: 15
    },
    minkovsky: {
        calc: ()=>{
            let x0 = 0,
                y0 = canvas.height / 2,
                x1 = canvas.width,
                y1 = canvas.height / 2;

            POINTS.push({
                x: x0,
                y: y0
            });

            Minkovsky(POINTS, depth_input.value, x0, y0, x1, y1);
        },
        depth: 2,
        max_depth: 5
    },
    hilbert: {
        calc: ()=>{
            Hilbert(POINTS, depth_input.value, canvas.width, canvas.height)
        },
        depth: 5,
        max_depth: 8
    }
}

for (let mood_name in mood_list) {
    mood_list[mood_name].button = document.getElementById(mood_name);
    mood_list[mood_name].button.addEventListener('click',()=>{
        SetMood(mood_name);
    });
}


let interval_id = null
let CURRENT_MOOD = ''

SetMood('dragon')
depth_input.onchange = animate_check.onchange = ()=>{SetMood()}



function SetMood(mood_name = null) {
    StopAnimation()
    if (!mood_name) mood_name = CURRENT_MOOD
    const mood = mood_list[mood_name];
    depth_input.max = mood.max_depth;

    if (CURRENT_MOOD != mood_name)
    {
//            if (depth_input.value > mood.max_depth)
        {
            depth_input.value = mood.depth;
        }

        if (CURRENT_MOOD) {
            mood_list[CURRENT_MOOD].button.classList.remove('active');
        }
    }

    mood.button.classList.add('active');
    CURRENT_MOOD = mood_name;


    canvas.style.opacity = '0.5';
    CalcMood(mood_name);
    setTimeout(()=>{
        animate_check.checked ? Animate() : DrawMood()
        canvas.style.opacity = '1';
    }, 100);


}

function CalcMood(mood_name) {
    POINTS = [];
    mood_list[mood_name].calc();
}
function DrawMood() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.beginPath();
    POINTS.forEach(point => ctx.lineTo(point.x, point.y));
    ctx.stroke();
}

function StopAnimation() {
    clearInterval(interval_id)
    interval_id = null
}

function Animate() {
    StopAnimation()

    ctx.beginPath()
    let i = 0
    interval_id = setInterval(()=>{

    requestAnimationFrame(()=>{

        if(!interval_id || i >= POINTS.length) {
            StopAnimation()
            return
        }

        ctx.clearRect(0,0,canvas.width,canvas.height)
        ctx.lineTo(POINTS[i].x, POINTS[i].y)
        ctx.stroke()

        ++i

    })

    },18);
}


function AnimateTimeout() {

    ctx.beginPath()
    POINTS.forEach((point,i) => {
        setTimeout(()=>{
            requestAnimationFrame(()=>{
                ctx.clearRect(0,0,canvas.width,canvas.height)
                ctx.lineTo(point.x, point.y)
                ctx.stroke()
            })
        }, i*18)
    });
}


