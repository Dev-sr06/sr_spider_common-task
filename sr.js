
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');

        
        const startButton = document.getElementById('startButton');

        const stopButton = document.getElementById('stopButton');

        const resetButton = document.getElementById('resetButton');

        const player1ScoreDisplay = document.getElementById('player1Score');

        const currentPlayerDisplay = document.getElementById('currentPlayerDisplay');
        
        const messageBox = document.getElementById('messageBox');

        let angle = 0; 
        let swingDirection = 1; 
        let isSwinging = false; 
        let animationFrameId; 

        let playerScore = 0; 
        
        let turnCount = 0;
        const MAX_TURNS = 1; 

        const stickLength = 100; 
        let pivotX;
        let pivotY; 

        function degToRad(degrees) {
            return degrees * Math.PI / 180;
        }

        function showMessage(text, isError = false) {
            messageBox.textContent = text;
            messageBox.classList.remove('hidden');
            if (isError) {
                messageBox.style.backgroundColor = '#FF4500'; 
                messageBox.style.color = 'white';
            }
            
            else {
                messageBox.style.backgroundColor = '#FFD700'; 
                messageBox.style.color = '#8B4513';
            }
        }

        function hideMessage() {
            messageBox.classList.add('hidden');
        }

        function drawMeter() {
            ctx.clearRect(0, 0, canvas.width, canvas.height); 

            ctx.save(); 
            ctx.translate(pivotX, pivotY); 

          
            const gradient = ctx.createRadialGradient(0, 0, stickLength + 20, 0, 0, stickLength + 70);
            gradient.addColorStop(0, '#D2B48C'); 
            gradient.addColorStop(1, '#BDB76B'); 
            
            ctx.beginPath();
            ctx.arc(0, 0, stickLength + 50, degToRad(180), degToRad(0), false); 
            ctx.lineWidth = 20;
            ctx.strokeStyle = gradient;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(0, 0, stickLength + 50, degToRad(90 - 15), degToRad(90 + 15)); 
            ctx.lineWidth = 30;
            ctx.strokeStyle = '#FFD700'; 
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(0, 0, stickLength + 50, degToRad(90), degToRad(90));
            ctx.lineTo(0, -(stickLength + 75)); 
            ctx.lineWidth = 5; 
            ctx.strokeStyle = '#FF4500';
            ctx.stroke();

            
            ctx.fillStyle = '#333';
            ctx.font = '20px Inter';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText('90°', 0, -(stickLength + 80)); 

            ctx.restore(); 
        }

        function drawStick(currentAngle) {
            ctx.save(); 
            ctx.translate(pivotX, pivotY); 

           
            const radAngle = degToRad(180 - currentAngle); 
            
            ctx.beginPath();
            ctx.moveTo(0, 0);
            const endX = stickLength * Math.cos(radAngle);
            const endY = -stickLength * Math.sin(radAngle); 
            ctx.lineTo(endX, endY);
            ctx.lineWidth = 10;
            ctx.lineCap = 'round';
            ctx.strokeStyle = '#333';
            ctx.stroke();

            
            ctx.beginPath();
            ctx.arc(endX, endY, 8, 0, Math.PI * 2);
            ctx.fillStyle = '#FFD700'; 
            ctx.fill();
            ctx.strokeStyle = '#8B4513';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(0, 0, 7, 0, Math.PI * 2);
            ctx.fillStyle = '#8B4513'; 
            ctx.fill();

            ctx.restore(); 
        }

       
        function calculateScore(finalAngle) {
            const deviation = Math.abs(finalAngle - 90);
           
            const score = Math.round(Math.max(0, 100 - (deviation / 90) * 100));
            return score;
        }

        function updateScoreDisplays() {
            player1ScoreDisplay.textContent = `Score: ${playerScore}`;
            currentPlayerDisplay.textContent = `Your Turn!`; 
        }

        function animate() {
            drawMeter();
            drawStick(angle);

            if (isSwinging) {
              
                const normalizedAngle = angle / 180 * Math.PI;
                const baseSpeed = 4; 
                const minSpeed = 0.5; 
               
                const speedFactor = (1 - Math.cos(normalizedAngle * 2)) / 2; 
                const swingSpeed = minSpeed + speedFactor * (baseSpeed - minSpeed);

                angle += swingDirection * swingSpeed;

              
                if (angle >= 180) {
                    angle = 180;
                    swingDirection = -1;
                } else if (angle <= 0) {
                    angle = 0;
                    swingDirection = 1;
                }
                animationFrameId = requestAnimationFrame(animate);
            }
        }

        function stopSwing() {
            if (!isSwinging) return;

            isSwinging = false;
            cancelAnimationFrame(animationFrameId);
            
            playerScore = calculateScore(angle); 
            updateScoreDisplays();

            showMessage(`You scored: ${playerScore}!`);

            turnCount++;
            if (turnCount < MAX_TURNS) { 
                setTimeout(() => {
                    showMessage(`Next turn. Press Spacebar to stop!`); 
                    stopButton.disabled = true;
                    startButton.disabled = false;
                }, 1500);
            }
             else 
             {
               
                showMessage(`Game Over! Your final score is ${playerScore}!`);
                stopButton.disabled = true;
                startButton.classList.add('hidden'); 
                resetButton.classList.remove('hidden'); 
            }
        }

        function startGame() {
            hideMessage();
            startButton.disabled = true;
            stopButton.disabled = false;
            resetButton.classList.add('hidden');

            if (turnCount === 0) { 
                playerScore = 0;
                updateScoreDisplays();
                showMessage('Good luck! Press Spacebar to stop.');
            }
            
            isSwinging = true;
            angle = 0; 
            swingDirection = 1; 
            animate();
        }

        function resetGame() {
            turnCount = 0;
            playerScore = 0; 

            updateScoreDisplays();

            angle = 0;
            swingDirection = 1;
            isSwinging = false;

            cancelAnimationFrame(animationFrameId); 
            drawMeter(); 
            drawStick(angle);
            showMessage('Welcome! Click "Start Game" to begin.');


            startButton.disabled = false;
            stopButton.disabled = true;
            resetButton.classList.add('hidden');
            startButton.classList.remove('hidden'); 
        }

        startButton.addEventListener('click', startGame);

        stopButton.addEventListener('click', stopSwing);

        resetButton.addEventListener('click', resetGame);

        document.addEventListener('keydown', (e) => {
            if (isSwinging && !stopButton.disabled) { 
                if (e.code === 'Space') { 
                    e.preventDefault(); 
                    stopSwing();
                }
            }
        });

        window.onload = function() {

            const updateCanvasSize = () => 
            
            {
                const containerWidth = canvas.parentElement.offsetWidth;
                canvas.width = Math.min(containerWidth * 0.9, 500);
                canvas.height = canvas.width * 0.5;
                
                pivotX = canvas.width / 2;
                pivotY = canvas.height - 20; 
                
                drawMeter(); 
                drawStick(angle);
            };

            updateCanvasSize(); 

            window.addEventListener('resize', updateCanvasSize); 

            resetGame(); 
        }