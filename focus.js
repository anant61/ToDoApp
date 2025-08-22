const checkBoxlist = document.querySelectorAll('.custom-checkbox');
const inputFields = document.querySelectorAll('.goal-input');
const progressValue = document.querySelector('.progress-value');
const errorLabel = document.querySelector('.error-label');

let allGoals = JSON.parse(localStorage.getItem('allGoals')) || {};

// Restore saved data when the page loads
inputFields.forEach((input, index) => {
  const savedGoal = allGoals[input.id];
  if (savedGoal) {
    input.value = savedGoal.name || '';
    if (savedGoal.completed) {
      input.parentElement.classList.add('completed');
    }
  }

  // Save changes when typing
  input.addEventListener('input', () => {
    allGoals[input.id] = { 
      name: input.value,
      completed: input.parentElement.classList.contains('completed')
    };
    localStorage.setItem('allGoals', JSON.stringify(allGoals));
  });
});

// Handle checkbox clicks
checkBoxlist.forEach((checkbox, index) => {
  checkbox.addEventListener('click', () => {
    const input = inputFields[index];

    if (input.value.trim() !== '') {
      checkbox.parentElement.classList.toggle('completed');

      // Update saved state in localStorage
      allGoals[input.id] = {
        name: input.value,
        completed: checkbox.parentElement.classList.contains('completed')
      };
      localStorage.setItem('allGoals', JSON.stringify(allGoals));

      // Count completed goals
      const completedCount = document.querySelectorAll('.goal-container.completed').length;
      const totalGoals = inputFields.length;
      const remainingGoals = totalGoals - completedCount;

      // Update progress bar
      const progress = (completedCount / totalGoals) * 100;
      progressValue.style.width = `${progress}%`;
      progressValue.style.display = 'flex';
      progressValue.querySelector('span').textContent = `${completedCount}/${totalGoals} completed`;

      // Update error message
      if (remainingGoals > 0) {
        errorLabel.textContent = `Please set ${remainingGoals} goal${remainingGoals > 1 ? 's' : ''}`;
        errorLabel.style.display = 'block';
      } else {
        errorLabel.style.display = 'none';
      }

    } else {
      errorLabel.textContent = 'Please fill this goal before marking it completed';
      errorLabel.style.display = 'block';
    }
  });
});
