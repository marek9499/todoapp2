# Lista zadań

[Live demo](https://marek9499.github.io/todoapp2/)

![responsive](https://github.com/marek9499/portfolio/blob/master/img/mockups/todoapp/Mockup.jpg)

## Użyte technologie

**HTML5**, **CSS (BEM)**, **JS**

## Opis 
Projekt SPA napisany w ramach ćwiczeń, którego działanie opiera się na dodawaniu/usuwaniu zadań.<br>
Logika aplikacji mieści się w pliku **Todo.js**, gdzie całość jest obiektem (singleton). Działanie każdej funkcji jest wyjaśnione komentarzem wyżej, jak również inicjacja zmiennych - która za co odpowiada. <br>
Zadania są przechowywane w **localStorage** po to aby po opuszczeniu strony użytkownik nadal widział które zadania pozostały do ukończenia (o ile 😉)<br>
W aplikacji jest bieżąca modyfikacja drzewa DOM, dynamicznie pojawiające się elementy, operacje na tablicach, obiektach, podpinanie zdarzeń.<br><br>

Strona również w pełni zachowuje responsywność, dzięki czemu działa na każdym urządzeniu.

## Struktura

```
|   index.html
|   readme.md
|   
\---assets
    +---css
    |       main.css
    |       
    \---js
            Todo.js
```