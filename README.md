## Description

## Installation

```bash
$ yarn
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```
## Manager Class Diagram
ManagerService Architecture
🏗️ Архитектурная схема
graph TB
    %% CLIENT LAYER
    Client[📱 Client Request] --> Controller[🎯 Controller Layer]
    
    %% CONTROLLER TO SERVICE
    Controller --> |processCorrection| MS[🏗️ ManagerService]
    Controller --> |processDeletion| MS
    
    %% SERVICE LAYER COMPONENTS
    MS --> |validates data| V1[✅ validateCorrectionData]
    MS --> |validates data| V2[✅ validateDeletionData]
    
    %% STRATEGY PATTERN
    MS --> |builds correction| CB[🔧 EquifaxCorrectionBuilder]
    MS --> |builds deletion| DB[🔧 EquifaxDeletionBuilder]
    
    %% BUILDERS IMPLEMENT INTERFACE
    CB -.-> |implements| IRB[📋 IEquifaxRequestBuilder]
    DB -.-> |implements| IRB
    
    %% TYPED OPTIONS
    MS --> |uses| CO[📝 CorrectionOptions]
    MS --> |uses| DO[📝 DeletionOptions]
    
    %% REPOSITORY PATTERN
    MS --> |calls| ER[🗄️ EquifaxRepository]
    ER --> |insertCorrection| DB1[(🏦 Database)]
    ER --> |insertDeletion| DB1
    
    %% CROSS-CUTTING CONCERNS
    MS --> |logs operations| Logger[📊 Logger]
    MS --> |throws exceptions| EH[⚠️ Error Handling]
    
    %% DATA FLOW
    CB --> |returns| CQ[📄 CorrectionQuery]
    DB --> |returns| DQ[📄 DeletionQuery]
    
    %% ENUMS AND TYPES
    subgraph "📚 Domain Types"
        OT[🏷️ OperationType<br/>CORRECTION | DELETION]
        PT[🏷️ ProviderType<br/>EQUIFAX | NBKI]
        SE[🏷️ Status Events<br/>PDL | INSTALLMENT]
    end
    
    %% STYLING
    classDef serviceClass fill:#e1f5fe,stroke:#0277bd,stroke-width:2px
    classDef builderClass fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef repoClass fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px
    classDef dataClass fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
    classDef interfaceClass fill:#fce4ec,stroke:#c2185b,stroke-width:2px,stroke-dasharray: 5 5
    
    class MS serviceClass
    class CB,DB builderClass
    class ER repoClass
    class CQ,DQ,CO,DO dataClass
    class IRB interfaceClass
🔄 Последовательность взаимодействий
sequenceDiagram
    participant C as 📱 Client
    participant MS as 🏗️ ManagerService
    participant V as ✅ Validator
    participant CB as 🔧 CorrectionBuilder
    participant DB as 🔧 DeletionBuilder
    participant R as 🗄️ Repository
    participant L as 📊 Logger
    participant D as 🏦 Database

    Note over C,D: 🔄 CORRECTION FLOW
    C->>MS: processCorrection(data, options)
    MS->>V: validateCorrectionData(data)
    
    alt ❌ Validation fails
        V-->>MS: throws HttpException
        MS-->>C: ❌ Bad Request
    else ✅ Validation passes
        V-->>MS: ✅ Valid
        MS->>CB: buildRequest(data, options)
        CB->>CB: 🔧 Apply business rules
        CB-->>MS: 📄 CorrectionQuery
        MS->>R: insertCorrection(query)
        R->>D: 💾 INSERT INTO corrections
        D-->>R: ✅ Success
        R-->>MS: ✅ Inserted
        MS->>L: 📝 Log success
        MS-->>C: ✅ CorrectionQuery
    end

    Note over C,D: 🗑️ DELETION FLOW
    C->>MS: processDeletion(data, options)
    MS->>V: validateDeletionData(data)
    
    alt ❌ Validation fails
        V-->>MS: throws HttpException
        MS-->>C: ❌ Bad Request
    else ✅ Validation passes
        V-->>MS: ✅ Valid
        MS->>DB: buildRequest(data, options)
        
        alt 🏢 NBKI Provider
            DB->>DB: 🔧 Set NBKI actions
            DB->>DB: 🔧 Add is_treaty if needed
        else 🏛️ EQUIFAX Provider
            DB->>DB: 🔧 Set EQUIFAX actions
            DB->>DB: 🔧 Choose treaty/application
        end
        
        DB-->>MS: 📄 DeletionQuery
        MS->>R: insertDeletion(query)
        R->>D: 💾 INSERT INTO api_bki_deleting
        D-->>R: ✅ Success
        R-->>MS: ✅ Inserted
        MS->>L: 📝 Log success
        MS-->>C: ✅ DeletionQuery
    end

    Note over C,D: ⚠️ ERROR HANDLING
    alt 💥 Database Error
        D-->>R: ❌ Database Error
        R-->>MS: ❌ throws Exception
        MS->>L: 📝 Log error
        MS-->>C: ❌ Internal Server Error
    end
```
