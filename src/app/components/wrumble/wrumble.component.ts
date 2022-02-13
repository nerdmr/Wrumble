import { Component, ElementRef, HostListener, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DictionaryService } from 'src/app/services/dictionary.service';

@Component({
    selector: 'app-wrumble',
    templateUrl: './wrumble.component.html',
    styleUrls: ['./wrumble.component.scss']
})
export class WrumbleComponent implements OnInit {

    Math = Math;
    
    @ViewChild('grid')
    grid: ElementRef<HTMLDivElement>;

    @ViewChildren('cell')
    cellElements: QueryList<ElementRef<HTMLElement>>;

    width = 5;
    cells = Array(this.width * this.width).fill(0);

    shiftDown: boolean;
    altDown: boolean;
    score: number = 0;
    playing = false;

    words: string[];

    columnTransforms: number[][]; // = [
    //     [2, 1, 3, 4, 5],
    //     [1, 2, 3, 4, 5],
    //     [1, 2, 3, 4, 5],
    //     [1, 2, 3, 4, 5],
    //     [1, 2, 3, 4, 5],
    // ]

    constructor(private dictionaryService: DictionaryService) {
        // this.setupGame();
    }

    dealGame() {

    }

    startGame() {
        this.startRound();
    }

    startRound() {
        this.playing = true;
    }

    private setupGame() {
        this.words = this.dictionaryService.getRandomWords(this.width);
        this.shuffleGame();
    }

    private shuffleGame() {
        this.columnTransforms = [ ];

        for (let i = 0; i < this.width; i++) {
            this.columnTransforms.push(this.shuffleArray(this.fill(this.width)));
        }
    }

    private fill(length: number) {
        const arr = [];
        for (let i = 0; i < length; i++) {
            arr.push(i + 1);            
        }
        return arr;
    }

    private shuffleArray(array: number[]) {
        let currentIndex = array.length,  randomIndex;
      
        // While there remain elements to shuffle...
        while (currentIndex != 0) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
      
        return array;
      }

    ngOnInit(): void {
        // console.log(this.getStringFromTransform());
        this.setupGame();

        setTimeout(() => {
            this.startGame();
        }, 0);
    }

    private onCellMove() {

        this.highlightCorrectWords();

        if (this.puzzleComplete()) {
            // alert('success!!');
        } else {
            // console.log('puzzle not copmlete');
        }
    }

    private highlightCorrectWords() {

        this.cellElements.map(c => (c.nativeElement as HTMLElement).classList.remove('highlight'));

        for (let i = 0; i < this.columnTransforms.length; i++) {

            let currentWord = '';

            for (let j = 0; j < this.columnTransforms[i].length; j++) {
                let row = this.columnTransforms[j][i] - 1;
                let col = j;
                currentWord += this.words[row][col];
            }

            if (
                this.words.indexOf(currentWord) !== -1
            ) {
                // highlight it
                for (let k = i * this.width; k < i * this.width + this.width; k++) {
                    (this.cellElements.toArray()[k].nativeElement as HTMLElement).classList.add('highlight');
                }
            }
        }

        this.score = this.grid.nativeElement?.querySelectorAll('.highlight').length;
    }

    private getStringFromTransform() {
        let runningSolution = '';
        
        for (let i = 0; i < this.columnTransforms.length; i++) {
            for (let j = 0; j < this.columnTransforms[i].length; j++) {
                let row = this.columnTransforms[j][i] - 1;
                let col = j;

                runningSolution += this.words[row][col];
            }
        }
        return runningSolution;
    }

    private puzzleComplete() {

        const currentWords = [];

        for (let i = 0; i < this.columnTransforms.length; i++) {

            let currentWord = '';

            for (let j = 0; j < this.columnTransforms[i].length; j++) {
                let row = this.columnTransforms[j][i] - 1;
                let col = j;
                currentWord += this.words[row][col];
            }

            if (
                this.words.indexOf(currentWord) === -1 &&
                !this.dictionaryService.isWord(currentWord)
            ) {
                return false;
            }

            currentWords.push(currentWord);
        }

        return true;
    }

    moveCellUp(i: number, j: number): number {
        let swap = j - 1;
        if (swap < 0) {
            swap = this.width - 1;
        }

        const hold = this.columnTransforms[i][swap];
        this.columnTransforms[i][swap] = this.columnTransforms[i][j];
        this.columnTransforms[i][j] = hold;
        return swap;
    }

    moveCellDown(i: number, j: number): number {
        let swap = j + 1;
        if (swap >= this.width) {
            swap = 0;
        }

        const hold = this.columnTransforms[i][swap];
        this.columnTransforms[i][swap] = this.columnTransforms[i][j];
        this.columnTransforms[i][j] = hold;
        return swap;
    }

    // i col
    // j row
    up(i: number, j: number) {
        // this.columnTransforms[i, j] was clicked up
        const swap = this.moveCellUp(i, j);

        if (this.altDown) {
            const start = Math.floor(i / this.width);
            const end = start + this.width;

            for (let col = start; col < end; col++) {
                if (col !== i) {
                    this.moveCellUp(col, j);
                }
            }

            this.deselectAll();
            this.selectRow(swap * this.width);
        }

        this.cellElements.map((cell) => cell.nativeElement)[swap * this.width + i].focus();

        this.onCellMove();

        
    }

    down(i: number, j: number) {
        // this.columnTransforms[i, j] was clicked down
        const swap = this.moveCellDown(i, j);

        if (this.altDown) {
            const start = Math.floor(i / this.width);
            const end = start + this.width;

            for (let col = start; col < end; col++) {
                if (col !== i) {
                    this.moveCellDown(col, j);
                }
            }
            
            this.deselectAll();
            this.selectRow(swap * this.width);
        }

        this.cellElements.map((cell) => cell.nativeElement)[swap * this.width + i].focus();

        this.onCellMove();
    }

    @HostListener('window:keyup', ['$event'])
    private keyup(event: KeyboardEvent) {
        if (this.altDown && !event.getModifierState('Alt')) {
            this.deselectAll();
        }
        
        this.shiftDown = event.getModifierState('Shift');
        this.altDown = event.getModifierState('Alt');
    }

    @HostListener('window:keydown', ['$event'])
    private keydown(event: KeyboardEvent) {

        this.shiftDown = event.getModifierState('Shift');
        
        if (this.shiftDown && !this.altDown && event.getModifierState('Alt')) {
            this.altDown = event.getModifierState('Alt');

            const selectedIndex = this.cellElements.map((cell) => cell.nativeElement).indexOf(document.activeElement as HTMLElement);
            
            if (selectedIndex >= 0) {
                this.selectRow(Math.floor(selectedIndex / this.width) * this.width);
                event.preventDefault();
                return;
            }
        }

        if (
            event.key !== 'ArrowUp' && event.key !== 'ArrowRight' && event.key !== 'ArrowLeft' && event.key !== 'ArrowDown'
        ) {
            return;
        }

        const focusedElement = document.activeElement;

        const cellEles: HTMLElement[] = this.cellElements.map((cell) => cell.nativeElement);
        const selectedIndex = cellEles.indexOf(focusedElement as HTMLElement);

        if (selectedIndex === -1) {
            cellEles[0].focus();
            event.preventDefault();
            return;
        }

        if (this.shiftDown && (event.key === 'ArrowRight' || event.key === 'ArrowLeft')) {
            return;
        }

        event.preventDefault();

        if (event.key === 'ArrowUp') {
            if (this.shiftDown) {
                this.up(selectedIndex % this.width, Math.floor(selectedIndex / this.width));
            } else {
                let colIndex = Math.floor(selectedIndex / this.width) - 1;
                let rowIndex = (selectedIndex % this.width);
    
                if (colIndex === -1) {
                    colIndex = this.width - 1;
                }
    
                cellEles[colIndex * this.width + rowIndex].focus();
            }            
        } else if (event.key === 'ArrowRight') {
            let rowIndex = (selectedIndex % this.width) + 1;
            const base = Math.floor(selectedIndex / this.width);
            if (rowIndex === this.width) {
                rowIndex = 0;
            }

            cellEles[base * this.width + rowIndex].focus();
        } else if (event.key === 'ArrowDown') {
            if (this.shiftDown) {
                this.down(selectedIndex % this.width, Math.floor(selectedIndex / this.width));
            } else {
                let colIndex = Math.floor(selectedIndex / this.width) + 1;
                let rowIndex = (selectedIndex % this.width);

                if (colIndex === this.width) {
                    colIndex = 0;
                }

                cellEles[colIndex * this.width + rowIndex].focus();
            }
        } else if (event.key === 'ArrowLeft') {
            let rowIndex = (selectedIndex % this.width) - 1;
            const base = Math.floor(selectedIndex / this.width);
            if (rowIndex === -1) {
                rowIndex = this.width - 1;
            }

            cellEles[base * this.width + rowIndex].focus();
        }
    }

    private selectRow(startIndex: number) {

        for (let i = startIndex; i < startIndex + this.width; i++) {
            this.cellElements.get(i)!.nativeElement.classList.add('selected');
        }
    }

    private deselectAll() {
        this.cellElements.map((cell) => cell.nativeElement.classList.remove('selected'));
    }
    
}
