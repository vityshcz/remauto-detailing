// НАСТРОЙКИ TELEGRAM (Вставь свои данные)
const TELEGRAM_TOKEN = 'ТВОЙ_TELEGRAM_TOKEN';
const TELEGRAM_CHAT_ID = 'ТВОЙ_CHAT_ID';

// Переменные состояния
let currentStep = 1;
const quizData = {
  carClass: '',
  goal: '',
  condition: '',
  contact: ''
};

// Элементы DOM
const modal = document.getElementById('quiz-modal');
const openBtn = document.getElementById('open-quiz');
const closeBtn = document.getElementById('close-quiz');
const progressBar = document.getElementById('progress-bar');
const quizSteps = document.querySelectorAll('.quiz-step');
const quizForm = document.getElementById('quiz-form');

// Открытие и закрытие модалки
openBtn.addEventListener('click', () => modal.classList.add('active'));
closeBtn.addEventListener('click', () => modal.classList.remove('active'));

// Обработка клика по вариантам выбора
document.querySelectorAll('.quiz-option').forEach(option => {
  option.addEventListener('click', (e) => {
    const selectedOption = e.currentTarget;
    const value = selectedOption.getAttribute('data-value');

    // Сохраняем ответ
    if (currentStep === 1) quizData.carClass = value;
    if (currentStep === 2) quizData.goal = value;
    if (currentStep === 3) quizData.condition = value;

    // Переходим на следующий шаг
    goToStep(currentStep + 1);
  });
});

// Функция смены шагов
function goToStep(step) {
  quizSteps.forEach(s => s.classList.remove('active'));
  currentStep = step;
  
  const activeStep = document.querySelector(`.quiz-step[data-step="${currentStep}"]`);
  if (activeStep) activeStep.classList.add('active');

  // Обновляем прогресс-бар (25%, 50%, 75%, 100%)
  progressBar.style.width = `${currentStep * 25}%`;
}

// Отправка формы
quizForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  quizData.contact = document.getElementById('contact-input').value;

  const message = `🔥 <b>Новая заявка с сайта!</b>\n\n` +
                  `🚗 <b>Класс авто:</b> ${quizData.carClass}\n` +
                  `🎯 <b>Задача:</b> ${quizData.goal}\n` +
                  `📊 <b>Состояние:</b> ${quizData.condition}\n` +
                  `📞 <b>Контакт:</b> ${quizData.contact}\n` +
                  `🎁 <b>Бонус:</b> Кондиционер для кожи`;

  // Отправляем в Telegram
  await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'HTML'
    })
  });

  // Экран успеха
  document.querySelector('.modal-content').innerHTML = `
    <h2 style="text-align: center; color: #00e5ff; margin-bottom: 15px;">Заявка принята! 🎉</h2>
    <p style="text-align: center; color: #a0a0b0;">Мы уже рассчитываем смету. Напишем вам в течение 5–10 минут.</p>
  `;
});
