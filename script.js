// Blockchain difficulty
const bcComplexity = "000000"
// Block div to toggle class effects when hash mismatch
const blockDiv = document.getElementsByClassName("block")[0];
const bcComplex = document.getElementsByClassName("bcComplex")[0];
const blockTime = document.getElementsByClassName("blockTime")[0];
// HTML Elements
const blockInput = document.getElementById('data');
const currentHashInput = document.getElementById('currentHash');
const blockHashInput = document.getElementById('blockHash');
const nonceInput = document.getElementById('nonce');
const mineButton = document.getElementById('mine');
const mineButtonLoading = document.getElementsByClassName('mine__loading')[0];
const blockTimeSeconds = document.getElementsByClassName('blockTime__seconds')[0];

// Init bcComplex
bcComplex.innerHTML  = bcComplexity;

// Add listeners
blockInput.addEventListener('input', updateHashHandler)
mineButton.addEventListener('click', mineHandler)

// Handlers
function updateHashHandler () {
    if (blockInput.value !== "") {
        // Enable mined button when block has content
        mineButton.disabled = false;
        // Check if current content is valid for the current block hash
        currentHashInput.value = hashBlock(blockInput.value, nonceInput.value);
        if (currentHashInput.value !== blockHashInput.value) 
            blockWrong(true)
        else
            blockWrong(false);
    } else {
        // No content no mining
        mineButton.disabled = true;
        currentHashInput.value = ""
    }
}


function  mineHandler () {
    // Show mining spinner and disable button
    toggleMining();
    // Minning executed async to avoid block js thread
    setTimeout(() => {
        let mined = false;
        let nonce = 0;
        let startTime = new Date();
        while (!mined) {
            nonceInput.value = nonce;
            blockHashInput.value = hashBlock(blockInput.value, nonce)
            if (blockHashInput.value.startsWith(bcComplexity)) {
                // Nonce is valid. Hash starts with the blockchain required complexity
                currentHashInput.value = blockHashInput.value;
                mined = true;
                blockDiv.classList.add("block--ok")
                blockDiv.classList.remove("block--error")
                console.log(new Date() - startTime);
                blockTimeSeconds.innerHTML = (new Date() - startTime)/1000;
            }
            // Increase nonce and try again (Proof of work = Brute force)
            nonce++;
        }
        toggleMining();
    }, 100)
};

// Helpers
function blockWrong (flag) {
    if (flag) {
        blockDiv.classList.remove("block--ok")
        blockDiv.classList.add("block--error")
    } else {
        blockDiv.classList.add("block--ok")
        blockDiv.classList.remove("block--error");
    }
}

function hashBlock (content, nonce) {
    return CryptoJS.SHA256(content + nonce).toString();
}

function toggleMining () {
    mineButtonLoading.classList.toggle("mine__loading--hidden");
    mineButton.disabled = !mineButton.disabled;
}