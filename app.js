const passwordInput = document.getElementById('password');
const strengthFill = document.getElementById('strengthFill');
const strengthText = document.getElementById('strengthText');
const copyFeedback = document.getElementById('copyFeedback');

// Requirements elements
const lengthReq = document.getElementById('lengthReq');
const upperReq = document.getElementById('upperReq');
const lowerReq = document.getElementById('lowerReq');
const numberReq = document.getElementById('numberReq');
const specialReq = document.getElementById('specialReq');
const sequenceReq = document.getElementById('sequenceReq');

let isPasswordVisible = false;

// Common sequences to check against
const commonSequences = [
    '123', '234', '345', '456', '567', '678', '789',
    'abc', 'bcd', 'cde', 'def', 'efg', 'fgh', 'ghi',
    'qwerty', 'asdf', 'zxcv', 'password', 'admin',
    '111', '222', '333', '444', '555', '666', '777', '888', '999'
];

function togglePassword() {
    const passwordField = document.getElementById('password');
    const toggleBtn = document.querySelector('.toggle-password');
    
    if (isPasswordVisible) {
        passwordField.type = 'password';
        toggleBtn.textContent = '👁️';
        isPasswordVisible = false;
    } else {
        passwordField.type = 'text';
        toggleBtn.textContent = '🙈';
        isPasswordVisible = true;
    }
}

function updateRequirement(element, isMet) {
    const icon = element.querySelector('.requirement-icon');
    const text = element.querySelector('.requirement-text');
    
    if (isMet) {
        element.classList.add('requirement-met');
        icon.textContent = '✅';
    } else {
        element.classList.remove('requirement-met');
        icon.textContent = '❌';
    }
}

function hasCommonSequence(password) {
    const lowerPassword = password.toLowerCase();
    return commonSequences.some(seq => lowerPassword.includes(seq));
}

function checkPasswordStrength(password) {
    let score = 0;
    let feedback = '';

    // Length check
    const hasLength = password.length >= 8;
    if (hasLength) score += 20;
    updateRequirement(lengthReq, hasLength);

    // Uppercase check
    const hasUpper = /[A-Z]/.test(password);
    if (hasUpper) score += 15;
    updateRequirement(upperReq, hasUpper);

    // Lowercase check
    const hasLower = /[a-z]/.test(password);
    if (hasLower) score += 15;
    updateRequirement(lowerReq, hasLower);

    // Number check
    const hasNumber = /[0-9]/.test(password);
    if (hasNumber) score += 15;
    updateRequirement(numberReq, hasNumber);

    // Special character check
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    if (hasSpecial) score += 15;
    updateRequirement(specialReq, hasSpecial);

    // Common sequence check
    const noCommonSeq = !hasCommonSequence(password);
    if (noCommonSeq) score += 10;
    updateRequirement(sequenceReq, noCommonSeq);

    // Length bonus
    if (password.length >= 12) score += 5;
    if (password.length >= 16) score += 5;

    // Determine strength level
    if (score < 30) {
        feedback = 'Very Weak';
        strengthFill.className = 'strength-fill strength-very-weak';
        strengthText.className = 'strength-text strength-very-weak';
    } else if (score < 50) {
        feedback = 'Weak';
        strengthFill.className = 'strength-fill strength-weak';
        strengthText.className = 'strength-text strength-weak';
    } else if (score < 70) {
        feedback = 'Fair';
        strengthFill.className = 'strength-fill strength-fair';
        strengthText.className = 'strength-text strength-fair';
    } else if (score < 90) {
        feedback = 'Good';
        strengthFill.className = 'strength-fill strength-good';
        strengthText.className = 'strength-text strength-good';
    } else {
        feedback = 'Strong';
        strengthFill.className = 'strength-fill strength-strong';
        strengthText.className = 'strength-text strength-strong';
    }

    // Update visual elements
    strengthFill.style.width = `${Math.min(score, 100)}%`;
    strengthText.textContent = password ? feedback : 'Enter a password to check its strength';

    return score;
}

function generatePassword() {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let password = '';
    let allChars = uppercase + lowercase + numbers + special;
    
    // Ensure at least one character from each category
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];
    
    // Generate remaining characters
    for (let i = 4; i < 16; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the password
    password = password.split('').sort(() => 0.5 - Math.random()).join('');
    
    // Update the input field
    passwordInput.value = password;
    checkPasswordStrength(password);
    
    // Copy to clipboard
    navigator.clipboard.writeText(password).then(() => {
        showCopyFeedback();
    });
}

function showCopyFeedback() {
    copyFeedback.classList.add('show');
    setTimeout(() => {
        copyFeedback.classList.remove('show');
    }, 3000);
}

// Real-time password strength checking
passwordInput.addEventListener('input', (e) => {
    checkPasswordStrength(e.target.value);
});

// Initialize
checkPasswordStrength('');