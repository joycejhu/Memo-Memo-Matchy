const board=document.getElementById("game-board");
const startBtn=document.getElementById("startBtn");
const restartBtn=document.getElementById("restartBtn");
const timerDisplay=document.getElementById("timer");
const pauseBtn=document.getElementById("pauseBtn");
const pauseOverlay=document.getElementById("pause-overlay");
const homeBtn=document.getElementById("homeBtn");

const gameIcons=["🍓","🍇","🍒","🍑","🍎","🍏","🍉","🥑"];
let allIcons=[...gameIcons,...gameIcons]; 
//☕ 意思：把上面 8 種水果重複一次，總共變成 16 張牌。... 是展開陣列的語法。
allIcons.sort(()=>0.5-Math.random());

let flippedCards=[];
let lockBoard=false;//沒鎖

let matchedPairs=0;

let gameStarted=false;
let timeInterval;
let startTime;

let isPaused=false;
let pausedTime=0;

board.style.display="none";
timerDisplay.style.display="none";

function formatTime(milliseconds){
    const totalSeconds=Math.floor(milliseconds/1000);
    const mins=Math.floor(totalSeconds/60);
    const secs=totalSeconds%60;
    const ms=milliseconds%10;
    return `${mins<10?'0':""}${mins}'${secs<10?'0':""}${secs}''${ms<10?"00":"0"}${ms}'''`;
}

function pauseTimer(){
    isPaused=true;
    pausedTime+=Date.now()-startTime;
    clearInterval(timeInterval);
}

function resumeTimer(){
    startTime=Date.now();
    isPaused=false;

    timeInterval=setInterval(()=>{
        const now=Date.now();
        const elapsed=now-startTime+pausedTime;
        timerDisplay.textContent=`Time: ${formatTime(elapsed)}`;
    },50);
}

function startTimer(){
    startTime=Date.now();

    timeInterval=setInterval(()=>{
        if(!isPaused){
            const now=Date.now();
            const elapsed=now-startTime+pausedTime;
            timerDisplay.textContent=`⏱️ Time: ${formatTime(elapsed)}`;
        }
    },50);
}

pauseBtn.addEventListener("click",()=>{
    if(!isPaused){
        pauseTimer();
        pauseBtn.textContent="▶️ Resume";
        pauseOverlay.style.display="flex"
    }else{
        resumeTimer();
        pauseBtn.textContent="⏸️ Pause";
        pauseOverlay.style.display="none";
    }
})


function stopTimer(){
    clearInterval(timeInterval);
}



startBtn.addEventListener("click",()=>{
    board.style.display="inline";
    startBtn.style.display="none";
    timer.style.display="inline";
    homeBtn.style.display="inline";

    gameStarted=true;
    pauseBtn.style.display="inline";
    startTimer();

    allIcons.forEach(icon=>{
    const card=document.createElement("div");
    card.className="card-box";
    card.innerHTML=`
        <div class="card-inner">
            <div class="card-front">❓</div>
            <div class="card-back">${icon}</div>
        </div>
    `;

    card.dataset.icon=icon;
    
    card.addEventListener('click',()=>{
        if(lockBoard||card.classList.contains("flipped")||isPaused) return;

        card.classList.add("flipped");
        flippedCards.push(card);

        if(flippedCards.length===2){
            lockBoard=true;
            const[card1,card2]=flippedCards;

            if(card1.dataset.icon===card2.dataset.icon){
                matchedPairs++;

                flippedCards=[];
                lockBoard=false;
                // ☕ 意思：如果這兩張的圖案一樣：
	            //          •清空翻牌暫存
	            //          •解鎖牌桌，讓你繼續點下一組

                if(matchedPairs===8){
                    stopTimer();
                    pauseBtn.disabled=true;
                    setTimeout(()=>{
                        if(confirm("Congratulations! You got it! Wanna play again?")){
                            location.reload();
                        }else{
                            alert("Stay at this moment. Let me enjoy the championship!");
                            setTimeout(()=>{
                                alert("Let's start a new game now!");
                                location.reload();
                            },3000)
                        }
                    },500);
                }

            }else{
                setTimeout(()=>{
                    card1.classList.remove("flipped");
                    card2.classList.remove("flipped");
                    flippedCards=[];
                    lockBoard=false;
                },500);
                // ☕ 意思：
	            // •過 1 秒（1000ms）後，把這兩張卡翻回去（移除 flipped）
	            // •再把暫存區清空
	            // •解鎖牌桌，讓你重新選牌
            }
        }
    });
    
    board.appendChild(card);
});
})

document.addEventListener("keydown",(event)=>{
    if(event.code==="Space"){
        event.preventDefault();
        if(!isPaused){
            pauseTimer();
            pauseBtn.textContent="▶️ Resume";
            pauseOverlay.style.display="flex"
        }else{
            resumeTimer();
            pauseBtn.textContent="⏸️ Pause";
            pauseOverlay.style.display="none";
        }
    }
})

homeBtn.addEventListener("click",()=>{
    window.location.href='index.html';
})