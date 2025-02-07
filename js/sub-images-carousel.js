document.addEventListener('DOMContentLoaded', function() {
    const subImagesWrapper = document.querySelector('.sub-images-wrapper');
    const subImagesSlides = document.querySelectorAll('.sub-images-slide');
    const prevButton = document.querySelector('.sub-images-button.prev');
    const nextButton = document.querySelector('.sub-images-button.next');
    const dotsContainer = document.querySelector('.sub-images-dots');

    let currentSlide = 0;
    const totalSlides = subImagesSlides.length;

    // 创建指示器点
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('sub-images-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }

    // 更新指示器
    function updateDots() {
        const dots = document.querySelectorAll('.sub-images-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    // 切换到指定幻灯片
    function goToSlide(index) {
        currentSlide = index;
        subImagesWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
        updateDots();
    }

    // 下一张幻灯片
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        goToSlide(currentSlide);
    }

    // 上一张幻灯片
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        goToSlide(currentSlide);
    }

    // 添加按钮事件监听器
    prevButton.addEventListener('click', prevSlide);
    nextButton.addEventListener('click', nextSlide);

    // 添加触摸滑动支持
    let touchStartX = 0;
    let touchEndX = 0;

    subImagesWrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });

    subImagesWrapper.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50) { // 最小滑动距离
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    });
});