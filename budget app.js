var budgetController = (function(){
	
	var Incomes = function(id , des , val){
		this.id = id;
		this.des = des;
		this.val = val;
	};
	
	var Expenses = function(id , des , val){
		this.id = id;
		this.des = des;
		this.val = val;
	};
    
    var calculateTotal = function(type){
        // calculate income and expense
        var sum = 0;
        data.allItems[type].forEach(function(curr){
            sum += curr.val;
        });
        data.totals[type] = sum;
    };
    
	var data = {
		
		allItems: {
			exp: [],
			inc: []
		},
		
		totals: {
			exp: 0,
			inc: 0
		},
		budget: 0,
        percentage: -1
        
	};
	
	return {
		addItem: function(type , des , val){
			var newItem , ID;
			if(data.allItems[type].length > 0){
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1; 
			}else{
				ID = 0;
			}
			if(type === 'inc'){
				newItem = new Incomes(ID , des , val);
			}else if(type === 'exp'){
				newItem = new Expenses(ID , des , val);
			}
			data.allItems[type].push(newItem);
            return newItem;
		},
        
        calculateBudget: function(){
            // income and expense calculate 
            calculateTotal('inc');
            calculateTotal('exp');
            
            // budget calculate
            data.budget = data.totals.inc - data.totals.exp;
            
            // percentage calculate
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp/data.totals.inc) * 100);
            }
        },
        
        calculatePercentages: function(){
            var getPerc , p;
            
                getPerc = data.allItems.exp.map(function(cur){
                    if(data.totals.inc > 0){
                        p = Math.round((cur.val/data.totals.inc)*100);
                    }else{
                        p = -1; 
                    }
                    return p;
                });
            
            return getPerc;
        },
        
        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },
        
        deleteItem: function(type , id){
            var ids ;
            ids = data.allItems[type].map(function(current){
                return current.id;
            })
            index = ids.indexOf(id);
            
            if(index !== -1){
                data.allItems[type].splice(index , 1);
            }
        },
        
		testing: function(){
            console.log(data);
        }
        
	}
	
})();

var uiController = (function(){
	
	var DOMstrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn',
        incomeContainer: ".income__list" ,
        expensesContainer: ".expenses__list",
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value' ,
        expenseLabel: '.budget__expenses--value' ,
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensePercLabel: '.item__percentage',
        monthLabel: ".budget__title--month",
        addTypeButton: ".add__type",
        addDesButton: ".add__description",
        addValueButton: ".add__value"
    };
    
    var formatNumber = function(num , type){
        var int , dec;
        // absolute number
        num = Math.abs(num);
        console.log('absolute ' + num);
        // putting decimal 
        num = num.toFixed(2);
        
        num = num.split('.');
        
        // adding comma
        int = num[0];
        if(int.length > 3){
            int = int.substr(0 , int.length-3) + ',' + int.substr(int.length-3 , 3);
        }
        dec = num[1];
        
        // adding + or - sign
        return (type === 'exp' ? '-' : '+') +  ' ' + int + '.' + dec ;
        
    };
	
	return {
		getInput: function(){
			return {
				type: document.querySelector(DOMstrings.inputType).value,
				description: document.querySelector(DOMstrings.inputDescription).value,
				value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
			};
		},
		
        // html text for exp and inc
        
        addListItem: function(obj , type){
            var html , newHtml , element;
            
            if(type === 'inc'){
                element = DOMstrings.incomeContainer;
        
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else if(type === 'exp'){
                element = DOMstrings.expensesContainer;
                
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div</div>';
            }
                
        // add actual value to html text
            
            newHtml = html.replace('%id%' , obj.id);
            newHtml = newHtml.replace('%description%' , obj.des);
            newHtml = newHtml.replace('%value%' , formatNumber(obj.val , type));
        
        // add code in html Dom
    
            document.querySelector(element).insertAdjacentHTML('beforeend' , newHtml);
        
        },
        
        deleteListItem: function(selectorID){
            
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
            
        },
        
        clearFields: function(){
            var fields;
            
            // return in list
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            
            // conveting in array
            fieldArr = Array.prototype.slice.call(fields);
            
            // empty input fields
            fieldArr.forEach(function(current , index , array){
                current.value = '';
            })
            
            // focus on description field
            fieldArr[0].focus();
            
        },
        
        displayBudget: function(obj){
            var type =
            obj.budget > 0 ? 'inc' : 'exp';
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget , type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc , 'inc');
            document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp , 'exp');
            document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage;
            
        },
        
        displayPercentages: function(percentages){
            var fields = document.querySelectorAll(DOMstrings.expensePercLabel);
            
            /*var nodeListForEach = function(list , callBack){
                for(var i = 0 ; i < list.length ; i++){
                    callBack(list[i] , i);
                }    
            };
            
            nodeListForEach(fields , function(cur , index){
                cur.textContent = percentages[index] + '%';
            }); */
            
            for(var i = 0 ; i < percentages.length ; i++){
                if(percentages[i] > 0){
                    fields[i].textContent = percentages[i];
                }else {
                    fields[i].textContent = '---';
                }
            }  
        },
        
        displayMonth: function(){
            var now , date , months , month , year;
            now = new Date();
            months = ['January' , 'February' , 'March' , 'April' , 'May' , 'June' , 'July' , 'August' , 'September' , 'October' , 'November' , 'December'];
            date = now.getDate();
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMstrings.monthLabel).textContent = date + ' ' + months[month] + ' ' + year;
        },
        
        changedType: function(){
            var l = document.querySelectorAll(DOMstrings.addTypeButton + ',' + DOMstrings.addDesButton + ',' + DOMstrings.addValueButton);
            
            for(var i = 0 ; i < l.length ; i++){
                l[i].classList.toggle('red-focus');
            }
            
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
            
        },
        
		getDOMstrings: function(){
			return DOMstrings;
		}
        
		
	}
	
})();

var controller = (function(budgetCtrl , uiCtrl){
	
	var setupEventListeners = function(){
		var DOM = uiCtrl.getDOMstrings();
		
		document.querySelector(DOM.inputBtn).addEventListener('click' , ctrlAddItem);
		document.addEventListener('keypress' , function(event){
			if(event === 13){
				ctrlAddItem();
			}
        });   
        document.querySelector(DOM.container).addEventListener('click' , ctrlDeleteItem);
            
        document.querySelector(DOM.addTypeButton).addEventListener('change' , uiCtrl.changedType);
	};
	
    var updatePercentage = function(){
        // calculate and get percentages
        var allPerc = budgetCtrl.calculatePercentages();
        
        // percentages UI
        uiCtrl.displayPercentages(allPerc);
    };
    
    var updateBudget = function(){
        // calculate budget
        budgetCtrl.calculateBudget();
        
        // return budget
        var budget = budgetCtrl.getBudget();
        
        // print budget
        uiCtrl.displayBudget(budget);
        console.log(budget);
        
    };
    
	var ctrlAddItem = function(){
		var input = uiCtrl.getInput();
        
        if(input.description !== '' && !isNaN(input.value) && input.value !== 0){
            var newItem = budgetCtrl.addItem(input.type , input.description, input.value);

            uiCtrl.addListItem(newItem , input.type);

            // clear fields
            uiCtrl.clearFields();
            
            updateBudget();
            
            updatePercentage();
        }
        
	};
    
    var ctrlDeleteItem = function(event){
        var itemID , sp , type , id
        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if(itemID){
            sp = itemID.split('-');
            type = sp[0];
            id = parseInt(sp[1]);
            console.log(id);
            
            // delete item from data structure
            budgetCtrl.deleteItem(type , id);
            
            // delete from UI
            uiCtrl.deleteListItem(itemID);
            
            // delete from budget value
            updateBudget();
            
            
            updatePercentage();
            
        }        
        
    };
    
	return{
		init: function(){
			uiCtrl.displayMonth();
            console.log('Application Started');
			setupEventListeners();
		}
	};
	
})(budgetController , uiController);

controller.init();

